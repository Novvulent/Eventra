
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Departamento, CreateDepartamentoRequest, UpdateDepartamentoRequest } from '../interfaces/departamento';

/** Operaciones CRUD de Departamentos contra la API REST (/api/departamentos). */
@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/departamentos`;

  getAll(params: Record<string, string | number> = {}): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.url, { params });
  }

  getById(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.url}/${id}`);
  }

  create(data: CreateDepartamentoRequest): Observable<Departamento> {
    return this.http.post<Departamento>(this.url, data);
  }

  update(id: number, data: UpdateDepartamentoRequest): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
