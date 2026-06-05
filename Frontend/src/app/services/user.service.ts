import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.backendBaseUrl}users`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`);
  }

  search(query: string): Observable<User[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<User[]>(`${this.baseUrl}/search`, { params });
  }

  getUserTasks(username: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/${username}/tasks`);
  }
}
