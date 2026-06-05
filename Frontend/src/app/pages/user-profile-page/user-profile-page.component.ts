import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <div>
          <h1>Mein Profil</h1>
          <p>Behalten Sie Ihre persönlichen Angaben und Berechtigungen im Blick.</p>
        </div>
      </div>
      <div class="profile-card" *ngIf="user">
        <h2>{{ user.displayName || user.username }}</h2>
        <p><strong>Benutzername:</strong> {{ user.username }}</p>
        <p><strong>E-Mail:</strong> {{ user.email || 'Nicht verfügbar' }}</p>
      </div>
      <div *ngIf="error" class="profile-card error-card">{{ error }}</div>
      <div *ngIf="!user && !error" class="profile-card">Lade Profildaten...</div>
    </section>
  `,
  styles: [
    ".profile-card { background: #fff; border-radius: 18px; padding: 28px; box-shadow: 0 12px 28px rgba(15,23,42,0.08); }",
    ".error-card { color: #b91c1c; background: #fee2e2; }",
    "h2 { margin-top: 0; }"
  ]
})
export class UserProfilePageComponent implements OnInit {
  user?: User;
  error?: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = {
          ...user
        };
        this.cdr.detectChanges();
      },
      error: () => {
        this.user = {
          username: this.authService.username,
          email: this.authService.email,
          displayName: this.authService.displayName
        };
        this.error = 'Profil konnte nicht geladen werden. Es werden nur Token-Daten angezeigt.';
        this.cdr.detectChanges();
      }
    });
  }
}
