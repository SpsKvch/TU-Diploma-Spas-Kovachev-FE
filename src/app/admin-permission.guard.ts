import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {RequestService} from "./services/request.service";
import {Constants} from "./constants";
import {firstValueFrom} from "rxjs";

export const adminPermissionGuard: CanActivateFn = async (route, state) => {

  const token: string | null = localStorage.getItem("authToken");

  if (token === null) {
    return false;
  }

  const router = inject(Router);
  const requestService = inject(RequestService);
  const permissions = await firstValueFrom(requestService.getProtectedEndpoint<string[]>(Constants.getPermissionsUrl, null));
  if (!permissions.includes('root') && !permissions.includes('admin')) {
    await router.navigate(["/unknown"])
    return false;
  }

  return true;
};
