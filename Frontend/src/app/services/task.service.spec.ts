import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { TaskService } from './task.service';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpTesting: HttpTestingController;

  const baseUrl = `${environment.backendBaseUrl}tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TaskService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Test Aufgabe',
        description: 'Beschreibung',
        status: 'TODO'
      } as Task
    ];

    service.getAll().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);
  });

  it('should get task by id', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Test Aufgabe',
      description: 'Beschreibung',
      status: 'TODO'
    } as Task;

    service.getById(1).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTask);
  });

  it('should create a task', () => {
    const newTask: Task = {
      title: 'Neue Aufgabe',
      description: 'Neue Beschreibung',
      status: 'TODO'
    } as Task;

    const createdTask: Task = {
      id: 1,
      title: 'Neue Aufgabe',
      description: 'Neue Beschreibung',
      status: 'TODO'
    } as Task;

    service.create(newTask).subscribe(task => {
      expect(task).toEqual(createdTask);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush(createdTask);
  });

  it('should update a task', () => {
    const updatedTask: Task = {
      id: 1,
      title: 'Geänderte Aufgabe',
      description: 'Geänderte Beschreibung',
      status: 'DONE'
    } as Task;

    service.update(updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);

    req.flush(updatedTask);
  });

  it('should delete a task', () => {
    service.delete(1).subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});