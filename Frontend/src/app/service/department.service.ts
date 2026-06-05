import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../dataaccess/department';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);


  public static readonly backendUrl = 'department';

  public getList(): Observable<Department[]> {
    return this.http.get<Department[]>(environment.backendBaseUrl + DepartmentService.backendUrl);
  }

  public getOne(id: number): Observable<Department> {
    return this.http.get<Department>(environment.backendBaseUrl + DepartmentService.backendUrl + `/${id}`);
  }

  public update(department: Department): Observable<Department> {
    return this.http.put<Department>(environment.backendBaseUrl + DepartmentService.backendUrl + `/${department.id}`, department);
  }

  public save(department: Department): Observable<Department> {
    return this.http.post<Department>(environment.backendBaseUrl + DepartmentService.backendUrl, department);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + DepartmentService.backendUrl + `/${id}`, {observe: 'response'});
  }
}
