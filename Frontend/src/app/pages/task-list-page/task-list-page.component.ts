import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { RoleService } from '../../services/role.service';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskCardComponent],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <div>
          <h1>Meine Aufgaben</h1>
          <p>Alle Aufgaben im Überblick mit Status, Kategorie und Priorität.</p>
        </div>
        <button type="button" *ngIf="roleService.hasUpdate()" routerLink="/tasks/new">Neue Aufgabe</button>
      </div>
      <div *ngIf="tasks.length; else emptyState">
        <app-task-card *ngFor="let task of tasks" [task]="task"></app-task-card>
      </div>
      <ng-template #emptyState>
        <div class="empty-state">
          <p>Keine Aufgaben gefunden. Erstellen Sie Ihre erste Aufgabe.</p>
        </div>
      </ng-template>
    </section>
  `,
  styles: [
    ".page-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }",
    "button { background: #457b9d; color: #fff; padding: 10px 18px; border: none; border-radius: 10px; cursor: pointer; }",
    ".empty-state { background: #fff; border-radius: 16px; padding: 28px; box-shadow: 0 8px 20px rgba(15,23,42,0.08); text-align: center; }"
  ]
})
export class TaskListPageComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    public roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.taskService.getAll().subscribe((tasks) => {
      this.tasks = tasks;
      this.cdr.detectChanges();
    });
  }
}
