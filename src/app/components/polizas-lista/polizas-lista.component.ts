import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Poliza } from '../../models/poliza';
import { PolizasService } from '../../services/polizas.service';
import { PolizasCoberturasService } from '../../services/polizas-coberturas.service';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';

interface PolizaVista extends Poliza {
  cantidad: number;
  total: number;
}

@Component({
  selector: 'app-polizas-lista',
  templateUrl: './polizas-lista.component.html',
  styleUrls: ['./polizas-lista.component.css']
})
export class PolizasListaComponent implements OnInit {
  polizas: PolizaVista[] = [];
  columnas = ['nombre', 'cantidad', 'total', 'acciones'];

  constructor(
    private polizasService: PolizasService,
    private detallesService: PolizasCoberturasService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  private avisar(mensaje: string): void {
    this.snack.open(mensaje, 'OK', { duration: 3000 });
  }

  cargar(): void {
    forkJoin({
      polizas: this.polizasService.getAll(),
      detalles: this.detallesService.getAll()
    }).subscribe({
      next: ({ polizas, detalles }) => {
        this.polizas = polizas.map((p) => {
          const propios = detalles.filter((d) => d.polizaId === p.id);
          return {
            ...p,
            cantidad: propios.length,
            total: propios.reduce((acc, d) => acc + d.montoAsegurado, 0)
          };
        });
      },
      error: () => this.avisar('No se pudieron cargar las pólizas')
    });
  }

  eliminar(p: PolizaVista): void {
    this.dialog
      .open(ConfirmarDialogComponent, {
        data: {
          titulo: 'Eliminar póliza',
          mensaje: `¿Eliminar "${p.nombre}" y todas sus coberturas?`
        }
      })
      .afterClosed()
      .subscribe((ok) => {
        if (!ok || !p.id) return;
        this.polizasService.delete(p.id).subscribe({
          next: () => {
            this.avisar('Póliza eliminada');
            this.cargar();
          },
          error: () => this.avisar('No se pudo eliminar la póliza')
        });
      });
  }
}