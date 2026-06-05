import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';
import { provideHttpClient } from '@angular/common/http';
import { Department } from '../dataaccess/department';
import { expect } from 'vitest';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;

  const fakeDepartments: Department[] = [
    {
      id: 1,
      name: 'Department 1',
    },
    {
      id: 2,
      name: 'Department 2',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: true },
    });
    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of departments', async () => {
    service.getList().subscribe({
      next: (data) => {
        expect(data).toHaveLength(fakeDepartments.length);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + DepartmentService.backendUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeDepartments);
  });

  it('should create a new department', async () => {
    const newDepartment: Department = {
      id: 3,
      name: 'Department 3',
    };
    service.save(newDepartment).subscribe({
      next: (department) => {
        expect(department).toEqual(newDepartment);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + DepartmentService.backendUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newDepartment);
  });

  it('should update an department', async () => {
    const department = fakeDepartments[0];
    department.name = 'Updated Department';

    service.update(department).subscribe({
      next: (department) => {
        expect(department.name).toEqual('Updated Department');
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${DepartmentService.backendUrl}/${fakeDepartments[0].id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(department);
  });

  it('should delete an existing department', async () => {
    service.delete(fakeDepartments[0].id).subscribe({
      next: (response) => {
        expect(response.status).toBe(200);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${DepartmentService.backendUrl}/${fakeDepartments[0].id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(fakeDepartments[0].id);
  });
});
