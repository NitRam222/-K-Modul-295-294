import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { CategoryBadgeComponent } from '../../components/category-badge/category-badge.component';
import { PriorityBadgeComponent } from '../../components/priority-badge/priority-badge.component';

@Component({
  selector: 'app-task-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryBadgeComponent, PriorityBadgeComponent],
  template: `
    <section class="page-shell" *ngIf="task; else loadingState">
      <div class="detail-header">
        <div>
          <h1>{{ task.title }}</h1>
          <p>{{ task.description || 'Keine Beschreibung verfügbar.' }}</p>
        </div>
        <div class="action-row" *ngIf="canEdit">
          <button routerLink="/tasks/edit/{{ task.id }}">Bearbeiten</button>
          <button class="secondary" type="button" (click)="toggleStatus()">{{ task.status === 'DONE' ? 'Auf TODO setzen' : 'Als erledigt markieren' }}</button>
          <button class="danger" (click)="onDelete()">Löschen</button>
        </div>
      </div>
      <div class="detail-meta">
        <app-category-badge [category]="task.category"></app-category-badge>
        <app-priority-badge [priority]="task.priority"></app-priority-badge>
        <span class="meta-item">Status: {{ task.status }}</span>
        <span class="meta-item">Besitzer: {{ task.owner?.displayName || task.user?.displayName || task.owner?.username || task.user?.username }}</span>
      </div>
    </section>
    <ng-template #loadingState>
      <div class="page-shell"><p>Lade Aufgabe...</p></div>
    </ng-template>
  `,
  styles: [
    ".detail-header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 18px; margin-bottom: 18px; }",
    ".action-row { display: flex; gap: 12px; }",
    "button { background: #457b9d; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; }",
    "button.danger { background: #e63946; }",
    ".detail-meta { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }",
    ".meta-item { background: #fff; padding: 10px 14px; border-radius: 14px; box-shadow: 0 4px 16px rgba(15,23,42,0.06); }"
  ]
})
export class TaskDetailPageComponent implements OnInit {
  task?: Task;
  canEdit = false;
  currentUser?: User;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private authService: AuthService,
    private roleService: RoleService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.updateCanEdit();
        this.cdr.detectChanges();
      },
      error: () => {
        this.currentUser = undefined;
        this.updateCanEdit();
        this.cdr.detectChanges();
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        return;
      }
      this.taskService.getById(id).subscribe({
        next: (task) => {
          this.task = task;
          this.updateCanEdit();
          this.cdr.detectChanges();
        },
        error: () => {
          this.task = undefined;
          this.cdr.detectChanges();
        }
      });
    });
  }

  onDelete(): void {
    if (!this.task?.id) {
      return;
    }
    if (window.confirm('Möchten Sie diese Aufgabe wirklich löschen?')) {
      this.taskService.delete(this.task.id).subscribe(() => location.reload());
    }
  }

  toggleStatus(): void {
    if (!this.task?.id) {
      return;
    }

    const currentStatus = this.task.status?.toUpperCase() || 'TODO';
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    const previousTask = this.task;
    const updatedTask: Task = {
      ...this.task,
      status: newStatus
    };

    this.task = { ...updatedTask };
    this.taskService.update(updatedTask).subscribe({
      next: (task) => {
        this.task = { ...task };
        this.updateCanEdit();
        this.cdr.detectChanges();
      },
      error: () => {
        this.task = previousTask;
        alert('Status konnte nicht aktualisiert werden.');
      }
    });
  }

  private updateCanEdit(): void {
    if (!this.task) {
      this.canEdit = false;
      return;
    }
    const owner = this.task.owner || this.task.user;
    if (!owner) {
      this.canEdit = false;
      return;
    }
    const currentId = this.currentUser?.id;
    if (this.roleService.hasUpdate() && currentId && owner.id) {
      this.canEdit = owner.id === currentId;
      return;
    }

    const currentName = this.authService.username?.toLowerCase();
    const currentEmail = this.authService.email?.toLowerCase();
    const currentDisplayName = this.authService.displayName?.toLowerCase();
    const ownerUsername = owner.username?.toLowerCase();
    const ownerEmail = owner.email?.toLowerCase();
    const ownerDisplayName = owner.displayName?.toLowerCase();

    const ownerValues = [ownerUsername, ownerEmail, ownerDisplayName].filter(Boolean) as string[];
    const currentValues = [currentName, currentEmail, currentDisplayName].filter(Boolean) as string[];

    this.canEdit = this.roleService.hasUpdate() && ownerValues.some((ownerValue) => currentValues.includes(ownerValue));
  }
}
