import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Cobertura } from '../../models/cobertura';
import { CoberturasService } from '../../services/coberturas.service';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';

@Component({
  selector: 'app-coberturas',
  templateUrl: './coberturas.component.html',
  styleUrls: ['./coberturas.component.css'],
})
export class CoberturasComponent implements OnInit {
  coberturas: Cobertura[] = [];
  columnas = ['nombre', 'acciones'];
  editandoId: number | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(256)]],
  });

  constructor(
    private fb: FormBuilder,
    private service: CoberturasService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  private avisar(mensaje: string): void {
    this.snack.open(mensaje, 'OK', { duration: 3000 });
  }

  cargar(): void {
    this.service.getAll().subscribe({
      next: (data) => (this.coberturas = data),
      error: () => this.avisar('No se pudieron cargar las coberturas'),
    });
  }

  guardar(formDir: FormGroupDirective): void {
    if (this.form.invalid) return;
    const nombre: string = this.form.value.nombre.trim();

    const peticion: Observable<unknown> = this.editandoId
      ? this.service.update(this.editandoId, { id: this.editandoId, nombre })
      : this.service.create({ nombre });

    peticion.subscribe(
      () => {
        this.avisar(
          this.editandoId ? 'Cobertura actualizada' : 'Cobertura creada',
        );
        this.cancelar(formDir);
        this.cargar();
      },
      () => this.avisar('No se pudo guardar la cobertura'),
    );
  }

  editar(c: Cobertura): void {
    this.editandoId = c.id ?? null;
    this.form.setValue({ nombre: c.nombre });
  }

  cancelar(formDir: FormGroupDirective): void {
    this.editandoId = null;
    formDir.resetForm({ nombre: '' });
  }

  eliminar(c: Cobertura): void {
    this.dialog
      .open(ConfirmarDialogComponent, {
        data: {
          titulo: 'Eliminar cobertura',
          mensaje: `¿Eliminar "${c.nombre}"? También se quitará de las pólizas que la usan.`,
        },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (!ok || !c.id) return;
        this.service.delete(c.id).subscribe({
          next: () => {
            this.avisar('Cobertura eliminada');
            this.cargar();
          },
          error: () => this.avisar('No se pudo eliminar la cobertura'),
        });
      });
  }
}
