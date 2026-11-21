
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Persona, CreatePersonaRequest, UpdatePersonaRequest } from '../interfaces/persona';

/** Operaciones CRUD de Personas contra la API REST (/api/personas). */
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/personas`;

  getAll(params: Record<string, string | number> = {}): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.url, { params });
  }

  getById(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.url}/${id}`);
  }

  create(data: CreatePersonaRequest): Observable<Persona> {
    return this.http.post<Persona>(this.url, data);
  }

  update(id: number, data: UpdatePersonaRequest): Observable<Persona> {
    return this.http.put<Persona>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }

}
