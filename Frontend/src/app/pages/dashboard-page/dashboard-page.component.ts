import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { PriorityService } from '../../services/priority.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page-shell">
      <div class="hero">
        <h1>Dashboard</h1>
        <p>Übersicht Ihrer Aufgaben, Kategorien und Prioritäten.</p>
      </div>
      <div class="tiles">
        <article class="tile">
          <h2>{{ taskCount }}</h2>
          <p>Meine Aufgaben</p>
          <a routerLink="/tasks">Aufgaben ansehen</a>
        </article>
        <article class="tile">
          <h2>{{ categoryCount }}</h2>
          <p>Kategorien</p>
          <a routerLink="/categories">Kategorien verwalten</a>
        </article>
        <article class="tile">
          <h2>{{ priorityCount }}</h2>
          <p>Prioritäten</p>
          <a routerLink="/priorities">Prioritäten anzeigen</a>
        </article>
      </div>
    </section>
  `,
  styles: [
    ".hero { margin-bottom: 28px; }",
    ".tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }",
    ".tile { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(15,23,42,0.08); }",
    ".tile h2 { margin: 0 0 12px; font-size: 2.4rem; color: #1d3557; }",
    ".tile a { color: #1d3557; font-weight: 600; text-decoration: none; }"
  ]
})
export class DashboardPageComponent implements OnInit {
  taskCount = 0;
  categoryCount = 0;
  priorityCount = 0;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private priorityService: PriorityService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskService.getAll().subscribe((tasks) => {
      this.taskCount = tasks.length;
      this.cdr.detectChanges();
    });
    this.categoryService.getAll().subscribe((categories) => {
      this.categoryCount = categories.length;
      this.cdr.detectChanges();
    });
    this.priorityService.getAll().subscribe((priorities) => {
      this.priorityCount = priorities.length;
      this.cdr.detectChanges();
    });
  }
}
