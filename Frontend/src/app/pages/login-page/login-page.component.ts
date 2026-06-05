import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell login-page">
      <div class="card">
        <h1>Willkommen bei SmartTask</h1>
        <p>Bitte melden Sie sich an, um Ihre Aufgaben, Kategorien und Prioritäten zu verwalten.</p>
        <button type="button" (click)="login()">Mit Keycloak anmelden</button>
      </div>
    </section>
  `,
  styles: [
    ".login-page { display: grid; min-height: calc(100vh - 72px); place-items: center; }",
    ".card { background: #fff; border-radius: 18px; padding: 36px; max-width: 420px; width: 100%; box-shadow: 0 18px 50px rgba(15,23,42,0.08); text-align: center; }",
    "h1 { margin-bottom: 18px; font-size: 2rem; }",
    "button { background: #1d3557; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; font-size: 1rem; cursor: pointer; }"
  ]
})
export class LoginPageComponent {
  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isAuthenticated) {
      router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.auth.login();
  }
}
