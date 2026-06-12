import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { CategoryBadgeComponent } from '../category-badge/category-badge.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CategoryBadgeComponent,
    PriorityBadgeComponent,
  ],
  template: `
    <article
      class="task-card"
      [routerLink]="clickable && task?.id ? ['/tasks', task?.id] : null"
      [class.no-click]="!clickable"
    >
      <header>
        <h3>{{ task?.title }}</h3>
        <span class="status">{{ task?.status }}</span>
      </header>
      <p>{{ task?.description || 'No description' }}</p>
      <div class="meta">
        <app-category-badge [category]="task?.category"></app-category-badge>
        <app-priority-badge [priority]="task?.priority"></app-priority-badge>
      </div>
      @if (canEdit && task?.id) {
        <div class="card-actions">
          <button
            class="btn-edit"
            [routerLink]="['/tasks/edit', task?.id]"
            (click)="$event.stopPropagation()"
          >
            Edit
          </button>
          <button class="btn-danger" (click)="deleteTask($event)">
            Delete
          </button>
        </div>
      }
      <footer>
        <small
          >Owner: {{ task?.owner?.username || task?.user?.username }}</small
        >
      </footer>
    </article>
  `,
  styles: [
    '.task-card { cursor: pointer; background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 12px; display: block; }',
    'header { display: flex; justify-content: space-between; margin-bottom: 8px; }',
    'h3 { margin: 0; font-size: 1rem; color: #1e293b; }',
    '.status { background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; color: #475569; }',
    '.meta { display: flex; gap: 8px; margin: 8px 0; }',
    '.card-actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9; }',
    'button { border: none; padding: 6px 16px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #fff; }',
    '.btn-edit { background: #457b9d; } .btn-edit:hover { background: #1d3557; }',
    '.btn-danger { background: #e63946; } .btn-danger:hover { background: #b91c1c; }',
    '.no-click { cursor: default; pointer-events: none; }',
    '.no-click .card-actions { pointer-events: auto; }',
    'footer { margin-top: 12px; color: #94a3b8; font-size: 0.75rem; }',
  ],
})
export class TaskCardComponent {
  @Input() task?: Task;
  @Input() clickable = true;
  @Output() deleted = new EventEmitter<void>();
  private readonly role = inject(RoleService);
  private readonly auth = inject(AuthService);
  private readonly taskService = inject(TaskService);

  get canEdit() {
    if (this.role.isAdmin()) return true;
    const owner = this.task?.owner || this.task?.user;
    if (!owner || !this.role.hasUpdate()) return false;
    const curUser = this.auth.username.toLowerCase();
    const curSub = this.auth.sub.toLowerCase();
    const ownerName = (owner.username || '').toLowerCase();
    const ownerEmail = (owner.email || '').toLowerCase();

    return (
      ownerName === curUser || ownerName === curSub || ownerEmail === curUser
    );
  }

  deleteTask(event: MouseEvent) {
    event.stopPropagation();
    if (this.task?.id && window.confirm('Sicher löschen?')) {
      this.taskService.delete(this.task.id).subscribe(() => {
        this.deleted.emit();
      });
    }
  }
}
