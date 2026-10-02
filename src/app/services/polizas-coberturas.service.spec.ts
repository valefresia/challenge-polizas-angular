import { TestBed } from '@angular/core/testing';

import { PolizasCoberturasService } from './polizas-coberturas.service';

describe('PolizasCoberturasService', () => {
  let service: PolizasCoberturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolizasCoberturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
