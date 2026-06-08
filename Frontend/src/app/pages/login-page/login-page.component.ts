import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="login-page">
      <div class="card">
        <h1>SmartTask</h1>
        <p>Bitte melden Sie sich an.</p>
        <button type="button" (click)="auth.login()">Mit Keycloak anmelden</button>
      </div>
    </section>
  `,
  styles: [
    ".login-page { display: grid; min-height: 80vh; place-items: center; }",
    ".card { background: #fff; border-radius: 18px; padding: 36px; box-shadow: 0 18px 50px rgba(0,0,0,0.05); text-align: center; }",
    "button { background: #1d3557; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }"
  ]
})
export class LoginPageComponent {
  auth = inject(AuthService);
  constructor() { if (this.auth.isAuthenticated) inject(Router).navigate(['/tasks']); }
}
