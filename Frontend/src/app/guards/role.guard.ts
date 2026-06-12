import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data?.['roles'] as string[];
  return (
    !roles ||
    roles.some((r) => auth.hasRole(r)) ||
    router.createUrlTree(['/tasks'])
  );
};
