// BEGIN AI-generated - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptors.service';
import { AuthService } from './auth.service';

// We test authInterceptor because it has branching logic that decides
// whether to attach the Authorization header. This is security-critical.

describe('authInterceptor', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create spy for AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
  });

  it('should add Authorization header when token exists', () => {
    // Arrange - store a token
    mockAuthService.getToken.and.returnValue('my-access-token');

    const mockRequest = new HttpRequest('GET', 'https://api.example.com/v1/users');
    const mockNext = jasmine.createSpy('next').and.returnValue(of({} as HttpEvent<any>));

    // Act - run the interceptor in injection context
    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext);
    });

    // Assert - the next function should have been called with a cloned request
    expect(mockNext).toHaveBeenCalled();
    const clonedRequest: HttpRequest<any> = mockNext.calls.mostRecent().args[0];
    expect(clonedRequest.headers.get('Authorization')).toBe('Bearer my-access-token');
  });

  it('should not add Authorization header when no token exists', () => {
    // Arrange - no token
    mockAuthService.getToken.and.returnValue(null);

    const mockRequest = new HttpRequest('GET', 'https://api.example.com/v1/data');
    const mockNext = jasmine.createSpy('next').and.returnValue(of({} as HttpEvent<any>));

    // Act
    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext);
    });

    // Assert - the original request should be passed through
    expect(mockNext).toHaveBeenCalled();
    const passedRequest: HttpRequest<any> = mockNext.calls.mostRecent().args[0];
    expect(passedRequest.headers.has('Authorization')).toBeFalse();
  });

  it('should skip auth header for S3 pre-signed URL requests', () => {
    // Arrange - URL contains X-Amz-Algorithm (S3 pre-signed URL)
    mockAuthService.getToken.and.returnValue('my-token');

    const mockRequest = new HttpRequest('PUT', 'https://s3.amazonaws.com/bucket/file?X-Amz-Algorithm=AWS4-HMAC-SHA256', {});
    const mockNext = jasmine.createSpy('next').and.returnValue(of({} as HttpEvent<any>));

    // Act
    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext);
    });

    // Assert - the original request should be passed through without modification
    expect(mockNext).toHaveBeenCalled();
    const passedRequest: HttpRequest<any> = mockNext.calls.mostRecent().args[0];
    // The original request should be passed without auth header
    expect(passedRequest.headers.has('Authorization')).toBeFalse();
  });
});

// END AI-generated - Following QuizApplication testing pattern
