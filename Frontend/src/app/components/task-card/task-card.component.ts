import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { CategoryBadgeComponent } from '../category-badge/category-badge.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryBadgeComponent, PriorityBadgeComponent],
  template: `
    <article class="task-card" [routerLink]="['/tasks', task?.id]">
      <header>
        <h3>{{ task?.title }}</h3>
        <span class="status">{{ task?.status }}</span>
      </header>
      <p>{{ task?.description || 'Keine Beschreibung vorhanden.' }}</p>
      <div class="meta">
        <app-category-badge [category]="task?.category"></app-category-badge>
        <app-priority-badge [priority]="task?.priority"></app-priority-badge>
      </div>
      <div class="card-actions" *ngIf="showEditButton && task?.id">
        <button type="button" [routerLink]="['/tasks/edit', task?.id]" (click)="$event.stopPropagation()">Bearbeiten</button>
      </div>
      <footer>
        <small>Besitzer: {{ task?.owner?.displayName || task?.user?.displayName || task?.owner?.username || task?.user?.username || 'Unbekannt' }}</small>
      </footer>
    </article>
  `,
  styles: [
    ".task-card { cursor: pointer; background: #fff; border-radius: 14px; padding: 18px; box-shadow: 0 4px 18px rgba(0,0,0,0.08); transition: transform .2s ease, box-shadow .2s ease; margin-bottom: 16px; }",
    ".task-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.12); }",
    "header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px; }",
    "h3 { margin: 0; font-size: 1.1rem; }",
    ".status { color: #1d3557; background: #a8dadc; border-radius: 999px; padding: 4px 10px; font-size: 0.75rem; font-weight: 600; }",
    "p { color: #4b5563; margin: 0 0 12px; }",
    ".meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }",
    ".card-actions { margin-bottom: 12px; }",
    ".card-actions button { background: #457b9d; color: #fff; padding: 8px 14px; border: none; border-radius: 10px; cursor: pointer; }",
    "footer { color: #6b7280; font-size: 0.8rem; }"
  ]
})
export class TaskCardComponent {
  @Input() task?: Task;

  constructor(public roleService: RoleService, private authService: AuthService) {}

  get showEditButton(): boolean {
    return this.roleService.hasUpdate() && this.isOwner();
  }

  private isOwner(): boolean {
    const owner = this.task?.owner || this.task?.user;
    if (!owner) {
      return false;
    }

    const currentName = this.authService.username?.toLowerCase();
    const currentEmail = this.authService.email?.toLowerCase();
    const currentDisplayName = this.authService.displayName?.toLowerCase();
    const ownerUsername = owner.username?.toLowerCase();
    const ownerEmail = owner.email?.toLowerCase();
    const ownerDisplayName = owner.displayName?.toLowerCase();

    const ownerValues = [ownerUsername, ownerEmail, ownerDisplayName].filter(Boolean) as string[];
    const currentValues = [currentName, currentEmail, currentDisplayName].filter(Boolean) as string[];

    return ownerValues.some((ownerValue) => currentValues.includes(ownerValue));
  }
}
