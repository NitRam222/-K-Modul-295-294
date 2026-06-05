import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { PriorityService } from '../../services/priority.service';
import { TaskService } from '../../services/task.service';
import { Category } from '../../models/category.model';
import { Priority } from '../../models/priority.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <div>
          <h1>{{ editMode ? 'Aufgabe bearbeiten' : 'Neue Aufgabe' }}</h1>
          <p>Verwalten Sie Titel, Beschreibung, Status, Kategorie und Priorität.</p>
        </div>
      </div>
      <form [formGroup]="form" (ngSubmit)="submit()" class="task-form">
        <label>Titel</label>
        <input formControlName="title" />
        <label>Beschreibung</label>
        <textarea formControlName="description"></textarea>
        <label>Status</label>
        <select formControlName="status">
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">In Arbeit</option>
          <option value="DONE">Erledigt</option>
        </select>
        <label>Kategorie</label>
        <select formControlName="categoryId">
          <option [value]="''">Keine</option>
          <option *ngFor="let category of categories" [value]="category.id">{{ category.name }}</option>
        </select>
        <label>Priorität</label>
        <select formControlName="priorityId">
          <option [value]="''">Keine</option>
          <option *ngFor="let priority of priorities" [value]="priority.id">{{ priority.level }}</option>
        </select>
        <label>Fälligkeit</label>
        <input type="date" formControlName="dueDate" />
        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">Speichern</button>
          <button type="button" class="secondary" routerLink="/tasks">Abbrechen</button>
        </div>
        <div *ngIf="errorMessage" class="form-error">{{ errorMessage }}</div>
      </form>
    </section>
  `,
  styles: [
    ".task-form { display: grid; gap: 16px; max-width: 640px; }",
    "label { font-weight: 600; }",
    "input, textarea, select { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font: inherit; }",
    "textarea { min-height: 120px; resize: vertical; }",
    ".form-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }",
    "button { background: #457b9d; color: #fff; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; }",
    "button.secondary { background: #e9ecef; color: #1f2937; }"
  ]
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  priorities: Priority[] = [];
  editMode = false;
  private taskId?: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private priorityService: PriorityService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['TODO', Validators.required],
      categoryId: [''],
      priorityId: [''],
      dueDate: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((categories) => (this.categories = categories));
    this.priorityService.getAll().subscribe((priorities) => (this.priorities = priorities));
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editMode = true;
      this.taskId = Number(idParam);
      this.taskService.getById(this.taskId).subscribe((task) => this.patchTask(task));
    }
  }

  private patchTask(task: Task): void {
    this.form.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      categoryId: task.category?.id ?? '',
      priorityId: task.priority?.id ?? '',
      dueDate: task.dueDate ?? ''
    });
  }

  errorMessage = '';

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.errorMessage = '';

    const values = this.form.value;
    const payload: Task = {
      id: this.taskId,
      title: values.title,
      description: values.description,
      status: values.status,
      category: values.categoryId ? { id: Number(values.categoryId), name: '' } : undefined,
      priority: values.priorityId ? { id: Number(values.priorityId), level: '' } : undefined,
      dueDate: values.dueDate || undefined
    };
    const request = this.editMode && this.taskId ? this.taskService.update(payload) : this.taskService.create(payload);
    request.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (error) => {
        this.errorMessage = 'Speichern fehlgeschlagen. Bitte überprüfen Sie Ihre Angaben oder versuchen Sie es später erneut.';
        console.error('Task save error', error);
      }
    });
  }
}
