import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PolizaCobertura } from '../models/poliza-cobertura';

@Injectable({ providedIn: 'root' })
export class PolizasCoberturasService {
  private url = `${environment.apiUrl}/PolizasCoberturas`;

  constructor(private http: HttpClient) {}

  getAll(polizaId?: number): Observable<PolizaCobertura[]> {
    let params = new HttpParams();
    if (polizaId) params = params.set('polizaId', polizaId);
    return this.http.get<PolizaCobertura[]>(this.url, { params });
  }
  create(d: PolizaCobertura): Observable<PolizaCobertura> {
    return this.http.post<PolizaCobertura>(this.url, d);
  }
  update(id: number, d: PolizaCobertura): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, d);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}