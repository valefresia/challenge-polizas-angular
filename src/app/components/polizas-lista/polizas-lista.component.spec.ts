import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolizasListaComponent } from './polizas-lista.component';

describe('PolizasListaComponent', () => {
  let component: PolizasListaComponent;
  let fixture: ComponentFixture<PolizasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolizasListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolizasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
