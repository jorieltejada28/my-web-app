import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAuthenticated = !!localStorage.getItem('jwtToken');

  if (isAuthenticated) {
      return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};
