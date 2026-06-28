import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lote } from '../models/lote.model';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private readonly apiUrl = '/api/lotes';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Lote[]> {
    return this.http.get<Lote[]>(this.apiUrl);
  }

  crear(payload: Partial<Lote>): Observable<Lote> {
    return this.http.post<Lote>(this.apiUrl, payload);
  }

  actualizar(id: number, payload: Partial<Lote>): Observable<Lote> {
    return this.http.put<Lote>(`${this.apiUrl}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
