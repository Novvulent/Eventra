
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Pais, CreatePaisRequest, UpdatePaisRequest } from '../interfaces/pais';

/** Operaciones CRUD de Países contra la API REST (/api/paises). */
@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/paises`;

  getAll(params: Record<string, string | number> = {}): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.url, { params });
  }

  getById(id: number): Observable<Pais> {
    return this.http.get<Pais>(`${this.url}/${id}`);
  }

  create(data: CreatePaisRequest): Observable<Pais> {
    return this.http.post<Pais>(this.url, data);
  }

  update(id: number, data: UpdatePaisRequest): Observable<Pais> {
    return this.http.put<Pais>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
