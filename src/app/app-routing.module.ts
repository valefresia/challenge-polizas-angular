import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoberturasComponent } from './components/coberturas/coberturas.component';
import { PolizasListaComponent } from './components/polizas-lista/polizas-lista.component';
import { PolizaFormComponent } from './components/poliza-form/poliza-form.component';

const routes: Routes = [
  { path: 'polizas', component: PolizasListaComponent },
  { path: 'polizas/nueva', component: PolizaFormComponent },
  { path: 'polizas/:id/editar', component: PolizaFormComponent },
  { path: 'coberturas', component: CoberturasComponent },
  { path: '', redirectTo: 'polizas', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}