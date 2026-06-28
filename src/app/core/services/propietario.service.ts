import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propietario } from '../models/propietario.model';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {
  private readonly apiUrl = '/api/propietarios';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Propietario[]> {
    return this.http.get<Propietario[]>(this.apiUrl);
  }

  crear(payload: Partial<Propietario>): Observable<Propietario> {
    return this.http.post<Propietario>(this.apiUrl, payload);
  }

  actualizar(id: number, payload: Partial<Propietario>): Observable<Propietario> {
    return this.http.put<Propietario>(`${this.apiUrl}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
