import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>{{ data.mensaje }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Eliminar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmarDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string }) {}
}