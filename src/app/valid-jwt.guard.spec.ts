import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validJwtGuard } from './valid-jwt.guard';

describe('validJwtGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validJwtGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
