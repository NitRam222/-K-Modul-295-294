import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-public-user-tasks-page',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <div>
          <h1>Fremde Aufgaben</h1>
          <p>Die Aufgaben werden im Lesemodus angezeigt. Bearbeiten ist nicht möglich.</p>
        </div>
      </div>
      <p *ngIf="ownerName">Aufgaben von {{ ownerName }}</p>
      <div *ngIf="tasks.length; else noTasks">
        <app-task-card *ngFor="let task of tasks" [task]="task"></app-task-card>
      </div>
      <ng-template #noTasks>
        <div class="empty-state">
          <p *ngIf="!errorMessage">Keine Aufgaben für diesen Benutzer gefunden.</p>
          <p *ngIf="errorMessage" class="error-text">{{ errorMessage }}</p>
        </div>
      </ng-template>
    </section>
  `,
  styles: [
    ".empty-state { background: #fff; border-radius: 16px; padding: 28px; box-shadow: 0 8px 20px rgba(15,23,42,0.08); text-align: center; margin-top: 18px; }"
  ]
})
export class PublicUserTasksPageComponent implements OnInit {
  tasks: Task[] = [];
  ownerName = '';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) {
      this.errorMessage = 'Ungültiger Benutzername.';
      return;
    }
    this.userService.getUserTasks(username).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.ownerName = tasks[0]?.owner?.displayName || tasks[0]?.user?.displayName || tasks[0]?.owner?.username || tasks[0]?.user?.username || '';
      },
      error: () => {
        this.errorMessage = 'Aufgaben dieses Benutzers konnten nicht geladen werden.';
      }
    });
  }
}
