import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'app-user-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TaskCardComponent],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <div>
          <h1>Benutzer suchen</h1>
          <p>Finden Sie andere Benutzer und sehen Sie deren Aufgaben im Lesemodus.</p>
        </div>
      </div>
      <form class="inline-form" (ngSubmit)="search()">
        <input [(ngModel)]="query" (ngModelChange)="onQueryChange()" name="query" placeholder="Benutzername oder Name suchen" autocomplete="off" />
        <button type="submit">Suchen</button>
      </form>
      <div *ngIf="query.trim().length >= 2 && loading" class="hint">
        Suche nach Benutzern...
      </div>
      <div *ngIf="query.trim().length >= 2 && !loading && users.length === 0" class="hint">
        Keine Benutzer gefunden.
      </div>
      <div *ngIf="query.trim().length >= 2 && users.length > 0" class="hint">
        Klicke einen Benutzer an, um seine Aufgaben anzuzeigen.
      </div>
      <ul class="list" *ngIf="users.length > 0">
        <li *ngFor="let user of users" (click)="loadUserTasks(user)">
          <div>
            <strong>{{ user.displayName || user.username }}</strong>
            <p>{{ user.email || 'Keine E-Mail' }}</p>
          </div>
          <button type="button" (click)="loadUserTasks(user); $event.stopPropagation()">Aufgaben anzeigen</button>
        </li>
      </ul>

      <section *ngIf="tasks.length || selectedUserName || errorMessage" class="tasks-shell">
        <h2 *ngIf="selectedUserName">Aufgaben von {{ selectedUserName }}</h2>
        <p *ngIf="errorMessage" class="error-text">{{ errorMessage }}</p>
        <div *ngIf="tasks.length; else noUserTasks">
          <app-task-card *ngFor="let task of tasks" [task]="task"></app-task-card>
        </div>
        <ng-template #noUserTasks>
          <div class="empty-state">
            <p *ngIf="!errorMessage">Keine Aufgaben für diesen Benutzer gefunden.</p>
          </div>
        </ng-template>
      </section>
    </section>
  `,
  styles: [
    ".inline-form { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }",
    "input { flex: 1; min-width: 240px; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; }",
    "button { background: #457b9d; color: #fff; border: none; padding: 12px 18px; border-radius: 10px; cursor: pointer; }",
    ".hint { margin-bottom: 12px; color: #334155; font-size: 0.95rem; }",
    ".list { list-style: none; padding: 0; margin: 0; }",
    ".list li { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 16px 18px; border-radius: 14px; box-shadow: 0 5px 16px rgba(15,23,42,0.06); margin-bottom: 12px; cursor: pointer; }",
    ".list li:hover { background: #f8fafc; }"
  ]
})
export class UserSearchPageComponent {
  query = '';
  users: User[] = [];
  tasks: Task[] = [];
  selectedUserName = '';
  errorMessage = '';
  loading = false;
  private searchTimeout?: number;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  onQueryChange(): void {
    this.errorMessage = '';
    this.selectedUserName = '';
    this.tasks = [];
    this.users = [];

    const trimmed = this.query.trim();
    if (trimmed.length < 2) {
      this.loading = false;
      return;
    }

    window.clearTimeout(this.searchTimeout);
    this.searchTimeout = window.setTimeout(() => this.search(), 250);
  }

  search(): void {
    const trimmed = this.query.trim();
    if (trimmed.length < 2) {
      this.users = [];
      this.loading = false;
      return;
    }

    this.loading = true;
    this.userService.search(trimmed).subscribe({
      next: (users) => {
        this.users = users;
        this.errorMessage = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.users = [];
        this.errorMessage = 'Benutzer konnten nicht geladen werden.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUserTasks(user: User): void {
    if (!user.username) {
      this.errorMessage = 'Benutzername ungültig.';
      return;
    }

    this.query = user.displayName || user.username || this.query;
    this.selectedUserName = user.displayName || user.username || '';
    this.errorMessage = '';
    this.tasks = [];
    this.users = [];
    this.loading = true;

    this.userService.getUserTasks(user.username).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.errorMessage = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.tasks = [];
        this.errorMessage = 'Aufgaben dieses Benutzers konnten nicht geladen werden.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private clearTaskView(): void {
    this.tasks = [];
    this.selectedUserName = '';
    this.errorMessage = '';
  }
}
