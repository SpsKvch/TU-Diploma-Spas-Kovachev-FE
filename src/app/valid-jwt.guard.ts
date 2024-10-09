import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const validJwtGuard: CanActivateFn = async (route, state) => {

  var token: string | null = localStorage.getItem("authToken");

  if (token === null) {
    localStorage.setItem("redirectUrl", state.url);
    inject(AuthService).redirectToLogin();
    return false;
  }

  const authService = inject(AuthService);
  try {
    await authService.authenticate(JSON.stringify(token));
  } catch (e) {
    localStorage.setItem("redirectUrl", state.url);
    await authService.clearLoginDetailsAndRedirectToLogin();
    return false;
  }
  return true;
};
