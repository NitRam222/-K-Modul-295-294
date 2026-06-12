import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export class UserProfilePageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly service = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  user?: User;
  error?: string;

  ngOnInit() {
    this.service.getProfile().subscribe({
      next: (u) => {
        this.user = u;
        this.cdr.detectChanges();
      },
      error: () => {
        this.user = {
          username: this.auth.username,
          email: this.auth.email,
          displayName: this.auth.displayName,
        };
        this.error = 'Profil konnte nicht geladen werden (Offline-Modus).';
        this.cdr.detectChanges();
      },
    });
  }
}
