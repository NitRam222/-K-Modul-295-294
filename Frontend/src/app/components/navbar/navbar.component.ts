import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/tasks">SmartTask</a>
      <div class="links" *ngIf="auth.isAuthenticated">
        <a routerLink="/tasks">Aufgaben</a>
        <a routerLink="/categories">Kategorien</a>
        <a routerLink="/priorities">Prioritäten</a>
        <a routerLink="/users/search">Benutzer</a>
        <a routerLink="/profile">Profil</a>
        <button (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [
    ".navbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #1d3557; color: #fff; }",
    ".brand { font-size: 1.2rem; font-weight: 700; color: #f1faee; text-decoration: none; }",
    ".links { display: flex; gap: 16px; align-items: center; }",
    ".links a, .links button { color: #f1faee; text-decoration: none; background: none; border: none; cursor: pointer; font: inherit; }"
  ]
})
export class NavbarComponent {
  auth = inject(AuthService);
}
