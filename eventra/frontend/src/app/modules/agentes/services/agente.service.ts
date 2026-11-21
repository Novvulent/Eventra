
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Agente, CreateAgenteRequest, UpdateAgenteRequest } from '../interfaces/agente';

/** Operaciones CRUD de Agentes contra la API REST (/api/agentes). */
@Injectable({
  providedIn: 'root'
})
export class AgenteService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/agentes`;

  getAll(params: Record<string, string | number> = {}): Observable<Agente[]> {
    return this.http.get<Agente[]>(this.url, { params });
  }

  getById(id: number): Observable<Agente> {
    return this.http.get<Agente>(`${this.url}/${id}`);
  }

  create(data: CreateAgenteRequest): Observable<Agente> {
    return this.http.post<Agente>(this.url, data);
  }

  update(id: number, data: UpdateAgenteRequest): Observable<Agente> {
    return this.http.put<Agente>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
