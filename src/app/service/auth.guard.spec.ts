// Auth Guard Tests - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

// We test AuthGuard because it controls route access based on login status.
// If the user is not logged in, it should redirect to the home page.

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spy objects for the dependencies the guard injects
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);

    // Create a mock UrlTree for redirect scenarios
    const mockUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(mockUrlTree);

    // Configure TestBed with mocks
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  // --- canActivate ---

  it('should return true when user is logged in for canActivate', () => {
    // Arrange - user is logged in
    mockAuthService.isLoggedIn.and.returnValue(true);

    // Act
    const result = guard.canActivate();

    // Assert - guard allows access
    expect(result).toBeTrue();
    // Router.parseUrl should NOT have been called
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });

  it('should return UrlTree to home when user is not logged in for canActivate', () => {
    // Arrange - user is NOT logged in
    mockAuthService.isLoggedIn.and.returnValue(false);
    const mockUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(mockUrlTree);

    // Act
    const result = guard.canActivate();

    // Assert - the guard should redirect to home
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe(mockUrlTree);
  });

  // --- canActivateChild ---

  it('should return true when user is logged in for canActivateChild', () => {
    // Arrange - user is logged in
    mockAuthService.isLoggedIn.and.returnValue(true);

    // Act
    const result = guard.canActivateChild();

    // Assert - guard allows access
    expect(result).toBeTrue();
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });

  it('should return UrlTree to home when user is not logged in for canActivateChild', () => {
    // Arrange - user is NOT logged in
    mockAuthService.isLoggedIn.and.returnValue(false);
    const mockUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(mockUrlTree);

    // Act
    const result = guard.canActivateChild();

    // Assert - the guard should redirect to home
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe(mockUrlTree);
  });

  // --- Edge cases ---

  it('should call isLoggedIn method from AuthService', () => {
    // Arrange
    mockAuthService.isLoggedIn.and.returnValue(true);

    // Act
    guard.canActivate();

    // Assert - verify the service method was called
    expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
  });
});
