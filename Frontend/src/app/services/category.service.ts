import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.backendBaseUrl}categories`;

  getAll() {
    return this.http.get<Category[]>(this.url);
  }
  create(category: Category) {
    return this.http.post<Category>(this.url, category);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
