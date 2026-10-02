import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Poliza } from '../models/poliza';

@Injectable({ providedIn: 'root' })
export class PolizasService {
  private url = `${environment.apiUrl}/Polizas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Poliza[]> {
    return this.http.get<Poliza[]>(this.url);
  }
  getById(id: number): Observable<Poliza> {
    return this.http.get<Poliza>(`${this.url}/${id}`);
  }
  create(p: Poliza): Observable<Poliza> {
    return this.http.post<Poliza>(this.url, p);
  }
  update(id: number, p: Poliza): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, p);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}