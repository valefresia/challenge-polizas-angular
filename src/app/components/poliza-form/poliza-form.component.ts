import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Cobertura } from '../../models/cobertura';
import { PolizaCobertura } from '../../models/poliza-cobertura';
import { CoberturasService } from '../../services/coberturas.service';
import { PolizasService } from '../../services/polizas.service';
import { PolizasCoberturasService } from '../../services/polizas-coberturas.service';

function sinCoberturasRepetidas(control: AbstractControl): ValidationErrors | null {
  const ids = (control as FormArray).controls
    .map((c) => c.value.coberturaId)
    .filter((id) => id !== null);
  return new Set(ids).size === ids.length ? null : { repetidas: true };
}

@Component({
  selector: 'app-poliza-form',
  templateUrl: './poliza-form.component.html',
  styleUrls: ['./poliza-form.component.css']
})
export class PolizaFormComponent implements OnInit {
  polizaId: number | null = null;
  coberturas: Cobertura[] = [];
  detallesOriginales: PolizaCobertura[] = [];
  guardando = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(256)]],
    detalles: this.fb.array([], [sinCoberturasRepetidas])
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private coberturasService: CoberturasService,
    private polizasService: PolizasService,
    private detallesService: PolizasCoberturasService
  ) {}

  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  get total(): number {
    return this.detalles.controls.reduce(
      (acc, c) => acc + (Number(c.value.montoAsegurado) || 0),
      0
    );
  }

  private avisar(mensaje: string): void {
    this.snack.open(mensaje, 'OK', { duration: 3000 });
  }

  ngOnInit(): void {
    this.coberturasService.getAll().subscribe({
      next: (data) => (this.coberturas = data),
      error: () => this.avisar('No se pudieron cargar las coberturas')
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.polizaId = Number(id);
      forkJoin({
        poliza: this.polizasService.getById(this.polizaId),
        detalles: this.detallesService.getAll(this.polizaId)
      }).subscribe({
        next: ({ poliza, detalles }) => {
          this.form.patchValue({ nombre: poliza.nombre });
          this.detallesOriginales = detalles;
          detalles.forEach((d) => this.detalles.push(this.nuevoDetalle(d)));
        },
        error: () => this.avisar('No se pudo cargar la póliza')
      });
    } else {
      this.agregarDetalle();
    }
  }

  nuevoDetalle(d?: PolizaCobertura): FormGroup {
    return this.fb.group({
      id: [d?.id ?? null],
      coberturaId: [d?.coberturaId ?? null, Validators.required],
      montoAsegurado: [d?.montoAsegurado ?? null, [Validators.required, Validators.min(0.01)]]
    });
  }

  agregarDetalle(): void {
    this.detalles.push(this.nuevoDetalle());
  }

  quitarDetalle(i: number): void {
    this.detalles.removeAt(i);
  }

  // true si esa cobertura ya está elegida en OTRA fila
  usada(coberturaId: number | undefined, indice: number): boolean {
    return this.detalles.controls.some(
      (c, i) => i !== indice && c.value.coberturaId === coberturaId
    );
  }

  guardar(): void {
    if (this.form.invalid || this.detalles.length === 0) return;
    this.guardando = true;

    const nombre: string = this.form.value.nombre.trim();
    const filas = this.detalles.value as {
      id: number | null;
      coberturaId: number;
      montoAsegurado: number;
    }[];

    const poliza$: Observable<number> = this.polizaId
      ? this.polizasService
          .update(this.polizaId, { id: this.polizaId, nombre })
          .pipe(map(() => this.polizaId as number))
      : this.polizasService.create({ nombre }).pipe(map((p) => p.id as number));

    poliza$.pipe(switchMap((id) => this.guardarDetalles(id, filas))).subscribe({
      next: () => {
        this.avisar(this.polizaId ? 'Póliza actualizada' : 'Póliza creada');
        this.router.navigate(['/polizas']);
      },
      error: () => {
        this.guardando = false;
        this.avisar('No se pudo guardar la póliza');
      }
    });
  }

  private guardarDetalles(
    polizaId: number,
    filas: { id: number | null; coberturaId: number; montoAsegurado: number }[]
  ): Observable<unknown> {
    const idsActuales = filas.filter((f) => f.id).map((f) => f.id);
    const aBorrar = this.detallesOriginales.filter((o) => !idsActuales.includes(o.id as number));

    const operaciones: Observable<unknown>[] = [
      ...aBorrar.map((o) => this.detallesService.delete(o.id as number)),
      ...filas.map((f) => {
        const body: PolizaCobertura = {
          polizaId,
          coberturaId: Number(f.coberturaId),
          montoAsegurado: Number(f.montoAsegurado)
        };
        return f.id
          ? this.detallesService.update(f.id, { ...body, id: f.id })
          : this.detallesService.create(body);
      })
    ];

    return operaciones.length ? forkJoin(operaciones) : of(null);
  }
}