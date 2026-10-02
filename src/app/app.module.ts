import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MaterialModule } from './modules/material/material.module';
import { CoberturasComponent } from './components/coberturas/coberturas.component';
import { PolizasListaComponent } from './components/polizas-lista/polizas-lista.component';
import { PolizaFormComponent } from './components/poliza-form/poliza-form.component';
import { ConfirmarDialogComponent } from './components/confirmar-dialog/confirmar-dialog.component';

@NgModule({
  declarations: [AppComponent, MenuComponent, CoberturasComponent, PolizasListaComponent, PolizaFormComponent, ConfirmarDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

