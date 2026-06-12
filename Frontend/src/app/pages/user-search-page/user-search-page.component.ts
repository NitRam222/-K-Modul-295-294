import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'app-user-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent],
  templateUrl: './user-search-page.component.html',
  styleUrl: './user-search-page.component.css',
})
export class UserSearchPageComponent {
  private readonly service = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  query = '';
  users: User[] = [];
  tasks: Task[] = [];
  selUser = '';

  search() {
    if (this.query.length < 2) return;
    this.service.search(this.query).subscribe((res) => {
      this.users = res;
      this.tasks = [];
      this.cdr.detectChanges();
    });
  }

  loadTasks(user: User) {
    this.service.getUserTasks(user.username).subscribe((res) => {
      this.tasks = res;
      this.selUser = user.displayName || user.username;
      this.users = [];
      this.cdr.detectChanges();
    });
  }
}
