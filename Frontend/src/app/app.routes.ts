import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { TaskListPageComponent } from './pages/task-list-page/task-list-page.component';
import { TaskDetailPageComponent } from './pages/task-detail-page/task-detail-page.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { PriorityPageComponent } from './pages/priority-page/priority-page.component';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { UserSearchPageComponent } from './pages/user-search-page/user-search-page.component';
import { PublicUserTasksPageComponent } from './pages/public-user-tasks-page/public-user-tasks-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AppRoles } from '../app.roles';

export const routes: Route[] = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'tasks', component: TaskListPageComponent },
      { path: 'tasks/new', component: TaskFormComponent, canActivate: [RoleGuard], data: { roles: [AppRoles.Update] } },
      { path: 'tasks/edit/:id', component: TaskFormComponent, canActivate: [RoleGuard], data: { roles: [AppRoles.Update] } },
      { path: 'tasks/:id', component: TaskDetailPageComponent },
      { path: 'categories', component: CategoryPageComponent },
      { path: 'priorities', component: PriorityPageComponent },
      { path: 'profile', component: UserProfilePageComponent },
      { path: 'users/search', component: UserSearchPageComponent },
      { path: 'users/:username/tasks', component: PublicUserTasksPageComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
