
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Administrador, CreateAdministradorRequest, UpdateAdministradorRequest } from '../interfaces/administrador';

/** Operaciones CRUD de Administradores contra la API REST (/api/administradores). */
@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/administradores`;

  getAll(params: Record<string, string | number> = {}): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(this.url, { params });
  }

  getById(id: number): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.url}/${id}`);
  }

  create(data: CreateAdministradorRequest): Observable<Administrador> {
    return this.http.post<Administrador>(this.url, data);
  }

  update(id: number, data: UpdateAdministradorRequest): Observable<Administrador> {
    return this.http.put<Administrador>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
