import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import { provideHttpClient } from '@angular/common/http';
import { Employee } from '../dataaccess/employee';
import { Department } from '../dataaccess/department';
import { expect } from 'vitest';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const fakeEmployees: Employee[] = [
    {
      id: 1,
      name: 'Meier',
      firstname: 'Max',
      badge: '123',
      department: new Department(),
    },
    {
      id: 2,
      name: 'Bianchi',
      firstname: 'Alessandra',
      badge: '456',
      department: new Department(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: true },
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of employees', async () => {
    service.getList().subscribe({
      next: (data) => {
        expect(data).toHaveLength(fakeEmployees.length);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + EmployeeService.backendUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeEmployees);
  });

  it('should create a new customer', async () => {
    const newEmployee: Employee = {
      id: 3,
      name: 'Müller',
      firstname: 'Max',
      badge: '789',
      department: new Department(),
    };

    service.save(newEmployee).subscribe({
      next: (department) => {
        expect(department).toEqual(newEmployee);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + EmployeeService.backendUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newEmployee);
  });

  it('should update an employee', async () => {
    const employee = fakeEmployees[0];
    employee.name = 'Updated Employee';

    service.update(employee).subscribe({
      next: (department) => {
        expect(department.name).toEqual('Updated Employee');
      },
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + `${EmployeeService.backendUrl}/${fakeEmployees[0].id}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(employee);
  });

  it('should delete an existing employee', async () => {
    service.delete(fakeEmployees[0].id).subscribe({
      next: (response) => {
        expect(response.status).toBe(200);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${EmployeeService.backendUrl}/${fakeEmployees[0].id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(fakeEmployees[0].id);
  });
});
