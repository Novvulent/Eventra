
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reserva, CreateReservaRequest, UpdateReservaRequest } from '../interfaces/reserva';

/** Operaciones CRUD de Reservas contra la API REST (/api/reservas). */
@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/reservas`;

  getAll(params: Record<string, string | number> = {}): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url, { params });
  }

  getById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.url}/${id}`);
  }

  create(data: CreateReservaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(this.url, data);
  }

  update(id: number, data: UpdateReservaRequest): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
