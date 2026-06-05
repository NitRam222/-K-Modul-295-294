import { TestBed } from '@angular/core/testing';

import { VehicleService } from './vehicle.service';
import { expect } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { Vehicle } from '../dataaccess/vehicle';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  const fakeVehicles: Vehicle[] = [
    {
      id: 1,
      vehicleType: 'CAR',
      description: 'Test vehicle 1',
      licence: '123',
    },
    {
      id: 2,
      vehicleType: 'CAR',
      description: 'Test vehicle 2',
      licence: '456',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: true },
    });
    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of vehicles', async () => {
    service.getList().subscribe({
      next: (data) => {
        expect(data).toHaveLength(fakeVehicles.length);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + VehicleService.backendUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeVehicles);
  });

  it('should create a new vehicle', async () => {
    const newVehicle: Vehicle = {
      id: 3,
      vehicleType: 'CAR',
      description: 'Test vehicle 3',
      licence: '789',
    };

    service.save(newVehicle).subscribe({
      next: (department) => {
        expect(department).toEqual(newVehicle);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + VehicleService.backendUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newVehicle);
  });

  it('should update an vehicle', async () => {
    const vehicle = fakeVehicles[0];
    vehicle.description = 'Updated Vehicle';

    service.update(vehicle).subscribe({
      next: (vehicle) => {
        expect(vehicle.description).toEqual('Updated Vehicle');
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${VehicleService.backendUrl}/${fakeVehicles[0].id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(vehicle);
  });

  it('should delete an existing vehicle', async () => {
    service.delete(fakeVehicles[0].id).subscribe({
      next: (response) => {
        expect(response.status).toBe(200);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${VehicleService.backendUrl}/${fakeVehicles[0].id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(fakeVehicles[0].id);
  });
});
