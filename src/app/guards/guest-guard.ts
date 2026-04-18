import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAuthenticated = !!localStorage.getItem('jwtToken');

  if (isAuthenticated) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  // If they ARE NOT logged in, let them see the Sign-In page
  return true;
};
