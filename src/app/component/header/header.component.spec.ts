// Header Component Tests - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../service/auth.service';
import { LoggedInUser } from '../../models/logged-in-user';

// We test HeaderComponent because it handles:
// - User authentication state display
// - Login/Signup modal triggers
// - Logout functionality
// - Sidebar toggle

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
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
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
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

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isUserLoggedIn as false', () => {
    // Assert
    expect(component.isUserLoggedIn).toBeFalse();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
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
    expect(component.user).toBeNull();
  }));

  it('should set isUserLoggedIn to true when user is logged in', fakeAsync(() => {
    // Act
    component.ngOnInit();
    userSubject.next(mockUser);
    tick();

    // Assert
    expect(component.isUserLoggedIn).toBeTrue();
    expect(component.user).toEqual(mockUser);
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
    expect(component.user).toBeNull();
  }));

  // --- onClickedSignIn ---

  it('should show login modal and hide signup modal when onClickedSignIn is called', () => {
    // Act
    component.onClickedSignIn();

    // Assert
    expect(component.showAuthModal.login).toBeTrue();
    expect(component.showAuthModal.signup).toBeFalse();
  });

  // --- handleLoginClose ---

  it('should hide both login and signup modals when handleLoginClose is called', () => {
    // Arrange - show login modal
    component.showAuthModal.login = true;
    component.showAuthModal.signup = true;

    // Act
    component.handleLoginClose();

    // Assert
    expect(component.showAuthModal.login).toBeFalse();
    expect(component.showAuthModal.signup).toBeFalse();
  });

  // --- toggelSidebar ---

  it('should emit toggleSidebar event when toggelSidebar is called', () => {
    // Arrange
    spyOn(component.toggleSidebar, 'emit');

    // Act
    component.toggelSidebar();

    // Assert
    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });

  // --- handleLogout ---

  it('should call handleLogout on AuthService and navigate to home', () => {
    // Act
    component.handleLogout();

    // Assert
    expect(mockAuthService.handleLogout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  // --- Input/Output ---

  it('should have isSidebarOpen input with default false', () => {
    // Assert
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should have toggleSidebar output event', () => {
    // Assert
    expect(component.toggleSidebar).toBeDefined();
  });
});
