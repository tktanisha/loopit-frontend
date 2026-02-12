// Home Component Tests - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

import { HomeComponent } from './home.component';
import { AuthService } from '../../service/auth.service';
import { LoggedInUser } from '../../models/logged-in-user';

// Mock child component to avoid subscription issues during cleanup
@Component({ selector: 'app-header', template: '', standalone: true })
class MockHeaderComponent {}

// We test HomeComponent because it handles:
// - User authentication state
// - Auth modal visibility (login/signup)
// - User subscription management

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let userSubject: BehaviorSubject<LoggedInUser | null>;

  const mockUser = {
    name: 'Test User',
    user_id: '1',
    role: 'user'
  } as unknown as LoggedInUser;

  beforeEach(async () => {
    // Create BehaviorSubject for user state
    userSubject = new BehaviorSubject<LoggedInUser | null>(null);

    // Create spy objects for dependencies
    mockAuthService = jasmine.createSpyObj('AuthService', ['handleLogout'], {
      user: userSubject
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(HomeComponent, {
      set: { imports: [MockHeaderComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // Initialize userSubject with a dummy subscription to prevent ngOnDestroy errors
    (component as any).userSubject = new Subscription();
  });

  afterEach(() => {
    // Safe cleanup
    if ((component as any).userSubject) {
      (component as any).userSubject.unsubscribe();
    }
  });

  // --- Basic instantiation ---

  it('should create the home component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with isUserLoggedIn as false', () => {
    // Assert
    expect(component.isUserLoggedIn).toBeFalse();
  });

  it('should initialize showAuthModal with login and signup as false', () => {
    // Assert
    expect(component.showAuthModal.login).toBeFalse();
    expect(component.showAuthModal.signup).toBeFalse();
  });

  // --- ngOnInit ---

  it('should subscribe to user changes on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert - initially no user
    expect(component.isUserLoggedIn).toBeFalse();
  }));

  it('should set isUserLoggedIn to true when user is logged in', fakeAsync(() => {
    // Act
    component.ngOnInit();
    userSubject.next(mockUser);
    tick();

    // Assert
    expect(component.isUserLoggedIn).toBeTrue();
  }));

  it('should set isUserLoggedIn to false when user logs out', fakeAsync(() => {
    // Arrange - start with logged in user
    component.ngOnInit();
    userSubject.next(mockUser);
    tick();

    // Act - user logs out
    userSubject.next(null);
    tick();

    // Assert
    expect(component.isUserLoggedIn).toBeFalse();
  }));

  // --- handleOnClose ---

  it('should hide both login and signup modals when handleOnClose is called', () => {
    // Arrange - show modals
    component.showAuthModal.login = true;
    component.showAuthModal.signup = true;

    // Act
    component.handleOnClose();

    // Assert
    expect(component.showAuthModal.login).toBeFalse();
    expect(component.showAuthModal.signup).toBeFalse();
  });
});
