import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminPermissionGuard } from './admin-permission.guard';

describe('adminPermissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminPermissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
