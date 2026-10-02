import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cobertura } from '../models/cobertura';

@Injectable({ providedIn: 'root' })
export class CoberturasService {
  private url = `${environment.apiUrl}/Coberturas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cobertura[]> {
    return this.http.get<Cobertura[]>(this.url);
  }
  create(c: Cobertura): Observable<Cobertura> {
    return this.http.post<Cobertura>(this.url, c);
  }
  update(id: number, c: Cobertura): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, c);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}