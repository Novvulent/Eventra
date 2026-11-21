
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../interfaces/cliente';

/** Operaciones CRUD de Clientes contra la API REST (/api/clientes). */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/clientes`;

  getAll(params: Record<string, string | number> = {}): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url, { params });
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  create(data: CreateClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, data);
  }

  update(id: number, data: UpdateClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
