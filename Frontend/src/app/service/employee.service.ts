import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Employee} from '../dataaccess/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'employee';

  public getList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(environment.backendBaseUrl + EmployeeService.backendUrl);
  }

  public getOne(id: number): Observable<Employee> {
    return this.http.get<Employee>(environment.backendBaseUrl + EmployeeService.backendUrl + `/${id}`);
  }

  public update(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(environment.backendBaseUrl + EmployeeService.backendUrl + `/${employee.id}`, employee);
  }

  public save(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(environment.backendBaseUrl + EmployeeService.backendUrl, employee);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + EmployeeService.backendUrl + `/${id}`, {observe: 'response'});
  }
}
