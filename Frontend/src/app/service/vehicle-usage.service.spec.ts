import { TestBed } from '@angular/core/testing';

import { VehicleUsageService } from './vehicle-usage.service';
import { expect } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { VehicleUsage } from '../dataaccess/vehicleUsage';
import { Vehicle } from '../dataaccess/vehicle';
import { Employee } from '../dataaccess/employee';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('VehicleUsageService', () => {
  let service: VehicleUsageService;
  let httpMock: HttpTestingController;

  const fakeVehicleUsages: VehicleUsage[] = [
    {
      id: 1,
      vehicle: new Vehicle(),
      employee: new Employee(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Bellinzona',
      text: 'Work transfer',
      km: 270,
    },
    {
      id: 2,
      vehicle: new Vehicle(),
      employee: new Employee(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Lugano',
      text: 'Work transfer',
      km: 300,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: true },
    });
    service = TestBed.inject(VehicleUsageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of vehicles usages', async () => {
    service.getList().subscribe({
      next: (data) => {
        expect(data).toHaveLength(fakeVehicleUsages.length);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + VehicleUsageService.backendUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeVehicleUsages);
  });

  it('should create a new vehicle usage', async () => {
    const newVehicleUsage: VehicleUsage = {
      id: 3,
      vehicle: new Vehicle(),
      employee: new Employee(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Chiasso',
      text: 'Work transfer',
      km: 340,
    };

    service.save(newVehicleUsage).subscribe({
      next: (department) => {
        expect(department).toEqual(newVehicleUsage);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + VehicleUsageService.backendUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newVehicleUsage);
  });

  it('should update an vehicle usage', async () => {
    const vehicleUsage = fakeVehicleUsages[0];
    vehicleUsage.text = 'Updated Vehicle Usage';

    service.update(vehicleUsage).subscribe({
      next: (vehicleUsage) => {
        expect(vehicleUsage.text).toEqual('Updated Vehicle Usage');
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${VehicleUsageService.backendUrl}/${fakeVehicleUsages[0].id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(vehicleUsage);
  });

  it('should delete an existing vehicle usage', async () => {
    service.delete(fakeVehicleUsages[0].id).subscribe({
      next: (response) => {
        expect(response.status).toBe(200);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${VehicleUsageService.backendUrl}/${fakeVehicleUsages[0].id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(fakeVehicleUsages[0].id);
  });
});
