
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Ciudad, CreateCiudadRequest, UpdateCiudadRequest } from '../interfaces/ciudad';

/** Operaciones CRUD de Ciudades contra la API REST (/api/ciudades). */
@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/ciudades`;

  getAll(params: Record<string, string | number> = {}): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.url, { params });
  }

  getById(id: number): Observable<Ciudad> {
    return this.http.get<Ciudad>(`${this.url}/${id}`);
  }

  create(data: CreateCiudadRequest): Observable<Ciudad> {
    return this.http.post<Ciudad>(this.url, data);
  }

  update(id: number, data: UpdateCiudadRequest): Observable<Ciudad> {
    return this.http.put<Ciudad>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
