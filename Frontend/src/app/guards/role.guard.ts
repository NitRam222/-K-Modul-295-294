import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data?.['roles'] as string[] | undefined;
    if (!requiredRoles || requiredRoles.some((role) => this.authService.hasRole(role))) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}
