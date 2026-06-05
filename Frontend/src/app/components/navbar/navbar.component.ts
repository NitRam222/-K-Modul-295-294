import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/dashboard">SmartTask</a>
      <div class="links" *ngIf="auth.isAuthenticated; else loginLink">
        <a routerLink="/tasks">Aufgaben</a>
        <a routerLink="/categories">Kategorien</a>
        <a routerLink="/priorities">Prioritäten</a>
        <a routerLink="/users/search">Benutzer</a>
        <a routerLink="/profile">Profil</a>
      </div>
      <ng-template #loginLink>
        <span class="navbar-spacer"></span>
      </ng-template>
      <div class="actions">
        <button type="button" class="link-button" *ngIf="auth.isAuthenticated" (click)="logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [
    ".navbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #1d3557; color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }",
    ".brand { font-size: 1.2rem; font-weight: 700; color: #f1faee; text-decoration: none; }",
    ".links a, .actions button { margin-left: 16px; color: #f1faee; text-decoration: none; background: none; border: none; cursor: pointer; font: inherit; }",
    ".links a:hover, .actions button:hover { text-decoration: underline; }",
    ".link-button { padding: 0; }"
  ]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private roleService: RoleService) {}

  logout(): void {
    this.auth.logout();
  }
}
