// Access Denied Guard (UserManagementGuard) Tests - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { UserManagementGuard } from './access-denied.guard';
import { AuthService } from './auth.service';

// We test UserManagementGuard because it controls access to admin-only routes.
// If the user is not an admin, it should redirect to the access-denied page.

describe('UserManagementGuard', () => {
  let guard: UserManagementGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spy objects for the dependencies the guard injects
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAdmin']);
    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);

    // Create a mock UrlTree for redirect scenarios
    const mockUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(mockUrlTree);

    // Configure TestBed with our mocks
    TestBed.configureTestingModule({
      providers: [
        UserManagementGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(UserManagementGuard);
  });

  // --- canActivate ---

  it('should return true when user is an admin', () => {
    // Arrange - user is admin
    mockAuthService.isAdmin.and.returnValue(true);

    // Act
    const result = guard.canActivate();

    // Assert - guard allows access
    expect(result).toBeTrue();
    // Router.parseUrl should NOT have been called
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });

  it('should return UrlTree to /access-denied when user is not an admin', () => {
    // Arrange - user is NOT an admin
    mockAuthService.isAdmin.and.returnValue(false);
    const mockUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(mockUrlTree);

    // Act
    const result = guard.canActivate();

    // Assert - the guard should redirect to access-denied page
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/access-denied');
    expect(result).toBe(mockUrlTree);
  });

  // --- Edge cases ---

  it('should call isAdmin method from AuthService', () => {
    // Arrange
    mockAuthService.isAdmin.and.returnValue(true);

    // Act
    guard.canActivate();

    // Assert - verify the service method was called
    expect(mockAuthService.isAdmin).toHaveBeenCalled();
  });

  it('should be injectable', () => {
    // Assert
    expect(guard).toBeTruthy();
  });
});
