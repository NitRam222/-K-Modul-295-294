import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { CategoryBadgeComponent } from '../../components/category-badge/category-badge.component';
import { PriorityBadgeComponent } from '../../components/priority-badge/priority-badge.component';

@Component({
  selector: 'app-task-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryBadgeComponent, PriorityBadgeComponent],
  template: `
    <section class="page-shell" *ngIf="task; else loading">
      <div class="detail-header">
        <h1>{{ task.title }}</h1>
        <div class="action-row" *ngIf="canEdit">
          <button [routerLink]="['/tasks/edit', task.id]">Edit</button>
          <button class="secondary" (click)="toggle()">{{ task.status === 'DONE' ? 'TODO' : 'Done' }}</button>
          <button class="danger" (click)="delete()">Del</button>
        </div>
      </div>
      <p>{{ task.description }}</p>
      <div class="detail-meta">
        <app-category-badge [category]="task.category"></app-category-badge>
        <app-priority-badge [priority]="task.priority"></app-priority-badge>
        <span>{{ task.status }}</span>
        <span>Owner: {{ task.owner?.username || task.user?.username }}</span>
      </div>
    </section>
    <ng-template #loading><p>Lade...</p></ng-template>
  `,
  styles: [
    ".detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }",
    ".action-row { display: flex; gap: 8px; }",
    "button { padding: 8px 14px; border: none; border-radius: 8px; cursor: pointer; background: #457b9d; color: #fff; }",
    ".danger { background: #e63946; } .secondary { background: #adb5bd; }",
    ".detail-meta { display: flex; gap: 12px; align-items: center; }"
  ]
})
export class TaskDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService);
  private readonly auth = inject(AuthService);
  private readonly role = inject(RoleService);
  private readonly cdr = inject(ChangeDetectorRef);

  task?: Task;
  canEdit = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.service.getById(id).subscribe(t => {
      this.task = t;
      this.updatePerms();
      this.cdr.detectChanges();
    });
  }

  delete() {
    if (this.task?.id && window.confirm('Löschen?')) this.service.delete(this.task.id).subscribe(() => history.back());
  }

  toggle() {
    if (!this.task) return;
    const update = { ...this.task, status: (this.task.status === 'DONE' ? 'TODO' : 'DONE') as any };
    this.service.update(update).subscribe(t => {
      this.task = t;
      this.cdr.detectChanges();
    });
  }

  private updatePerms() {
    if (this.role.isAdmin()) { this.canEdit = true; return; }
    const owner = this.task?.owner || this.task?.user;
    if (!owner || !this.role.hasUpdate()) { this.canEdit = false; return; }
    const curUser = this.auth.username.toLowerCase();
    const curSub = this.auth.sub.toLowerCase();
    const ownerName = (owner.username || '').toLowerCase();
    const ownerEmail = (owner.email || '').toLowerCase();
    
    this.canEdit = ownerName === curUser || ownerName === curSub || ownerEmail === curUser;
  }
}
