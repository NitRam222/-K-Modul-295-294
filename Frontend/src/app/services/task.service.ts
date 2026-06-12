import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.backendBaseUrl}tasks`;

  getAll() {
    return this.http.get<Task[]>(this.url);
  }
  getById(id: number) {
    return this.http.get<Task>(`${this.url}/${id}`);
  }
  create(task: Task) {
    return this.http.post<Task>(this.url, task);
  }
  update(task: Task) {
    return this.http.put<Task>(`${this.url}/${task.id}`, task);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
