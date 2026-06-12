import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { PriorityService } from '../../services/priority.service';
import { TaskService } from '../../services/task.service';
import { Category } from '../../models/category.model';
import { Priority } from '../../models/priority.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly catService = inject(CategoryService);
  private readonly prioService = inject(PriorityService);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['TODO', Validators.required],
    categoryId: [''],
    priorityId: [''],
    dueDate: [''],
  });
  categories: Category[] = [];
  priorities: Priority[] = [];
  editMode = false;
  private id?: number;

  ngOnInit() {
    this.catService.getAll().subscribe((d) => (this.categories = d));
    this.prioService.getAll().subscribe((d) => (this.priorities = d));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.id = +id;
      this.taskService.getById(this.id).subscribe((t) =>
        this.form.patchValue({
          title: t.title,
          description: t.description,
          status: t.status,
          categoryId: (t.category?.id as any) || '',
          priorityId: (t.priority?.id as any) || '',
          dueDate: t.dueDate || '',
        }),
      );
    }
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: any = {
      ...v,
      id: this.id,
      category: v.categoryId ? { id: +v.categoryId } : null,
      priority: v.priorityId ? { id: +v.priorityId } : null,
    };
    (this.editMode
      ? this.taskService.update(payload)
      : this.taskService.create(payload)
    ).subscribe(() => this.router.navigate(['/tasks']));
  }
}
