import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cita } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly apiUrl = environment.apiCitas;

  constructor(private http: HttpClient) {}

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas`);
  }

  getCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/citas/${id}`);
  }

  createCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/citas`, cita);
  }

  updateCita(id: number, cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, cita);
  }

  deleteCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/citas/${id}`);
  }
}
