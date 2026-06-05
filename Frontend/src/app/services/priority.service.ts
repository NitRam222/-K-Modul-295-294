import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Priority } from '../models/priority.model';

@Injectable({ providedIn: 'root' })
export class PriorityService {
  private readonly baseUrl = `${environment.backendBaseUrl}priorities`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Priority[]> {
    return this.http.get<Priority[]>(this.baseUrl);
  }

  create(priority: Priority): Observable<Priority> {
    return this.http.post<Priority>(this.baseUrl, priority);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
