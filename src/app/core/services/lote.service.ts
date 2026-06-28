import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lote } from '../models/lote.model';

interface ReporteSolicitudResponse {
  ruta?: string;
  path?: string;
  filePath?: string;
  archivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private readonly apiUrl = '/api/lotes';
  private readonly apiReporteUrl = '/api/reportes';

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

  solicitarReporte(loteId: number, tipo = 'PDF'): Observable<ReporteSolicitudResponse> {
    return this.http.post<ReporteSolicitudResponse>(`${this.apiReporteUrl}/solicitar`, {
      loteId,
      tipo
    });
  }

  descargarReporte(ruta: string): Observable<Blob> {
    const encodedRuta = encodeURIComponent(ruta);
    return this.http.get(`${this.apiReporteUrl}/descargar?ruta=${encodedRuta}`, {
      responseType: 'blob'
    });
  }
}
