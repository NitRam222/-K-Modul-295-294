import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private authService: AuthService) {}

  hasRead(): boolean {
    return this.authService.hasRole('read');
  }

  hasUpdate(): boolean {
    return this.authService.hasRole('update');
  }

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }
}
