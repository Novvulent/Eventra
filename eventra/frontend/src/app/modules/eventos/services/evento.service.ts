
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Evento, CreateEventoRequest, UpdateEventoRequest } from '../interfaces/evento';

/** Operaciones CRUD de Eventos contra la API REST (/api/eventos). */
@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/eventos`;

  getAll(params: Record<string, string | number> = {}): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.url, { params });
  }

  getById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.url}/${id}`);
  }

  create(data: CreateEventoRequest): Observable<Evento> {
    return this.http.post<Evento>(this.url, data);
  }

  update(id: number, data: UpdateEventoRequest): Observable<Evento> {
    return this.http.put<Evento>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
