import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  templateUrl: './task-list-page.component.html',
  styleUrl: './task-list-page.component.css',
})
export class TaskListPageComponent implements OnInit {
  private readonly service = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly role = inject(RoleService);

  tasks: Task[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe((d) => {
      this.tasks = d;
      this.cdr.detectChanges();
    });
  }
}
