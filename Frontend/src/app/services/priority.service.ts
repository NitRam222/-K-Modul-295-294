import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Priority } from '../models/priority.model';

@Injectable({ providedIn: 'root' })
export class PriorityService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.backendBaseUrl}priorities`;

  getAll() {
    return this.http.get<Priority[]>(this.url);
  }
  create(priority: Priority) {
    return this.http.post<Priority>(this.url, priority);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
