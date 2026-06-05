import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Vehicle} from '../dataaccess/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'vehicle';

  public getList(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(environment.backendBaseUrl + VehicleService.backendUrl);
  }

  public getOne(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(environment.backendBaseUrl + VehicleService.backendUrl + `/${id}`);
  }

  public update(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(environment.backendBaseUrl + VehicleService.backendUrl + `/${vehicle.id}`, vehicle);
  }

  public save(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(environment.backendBaseUrl + VehicleService.backendUrl, vehicle);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + VehicleService.backendUrl + `/${id}`, {observe: 'response'});
  }
}
