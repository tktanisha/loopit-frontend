// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthComponent } from './auth.component';

// We test AuthComponent because it handles:
// - Switching between login and signup views
// - Closing auth modal
// - Managing auth modal visibility state

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Basic instantiation ---

  it('should create the auth component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize showAuth with login and signup as false', () => {
    // Assert
    expect(component.showAuth.login).toBeFalse();
    expect(component.showAuth.signup).toBeFalse();
  });

  // --- onSwitchToSignup ---

  it('should switch to signup view when onSwitchToSignup is called', () => {
    // Arrange - start with login visible
    component.showAuth = { login: true, signup: false };

    // Act
    component.onSwitchToSignup();

    // Assert
    expect(component.showAuth.login).toBeFalse();
    expect(component.showAuth.signup).toBeTrue();
  });

  // --- onSwitchToLogin ---

  it('should switch to login view when onSwitchToLogin is called', () => {
    // Arrange - start with signup visible
    component.showAuth = { login: false, signup: true };

    // Act
    component.onSwitchToLogin();

    // Assert
    expect(component.showAuth.login).toBeTrue();
    expect(component.showAuth.signup).toBeFalse();
  });

  // --- onClose ---

  it('should hide both modals and emit closeEvent when onClose is called', () => {
    // Arrange
    component.showAuth = { login: true, signup: false };
    spyOn(component.closeEvent, 'emit');

    // Act
    component.onClose();

    // Assert
    expect(component.showAuth.login).toBeFalse();
    expect(component.showAuth.signup).toBeFalse();
    expect(component.closeEvent.emit).toHaveBeenCalled();
  });

  // --- onChildClose ---

  it('should emit closeEvent when onChildClose is called', () => {
    // Arrange
    spyOn(component.closeEvent, 'emit');

    // Act
    component.onChildClose();

    // Assert
    expect(component.closeEvent.emit).toHaveBeenCalled();
  });

  // --- ngOnInit ---

  it('should initialize showAuth if undefined', () => {
    // Arrange
    component.showAuth = undefined as any;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.showAuth).toEqual({ login: false, signup: false });
  });

  // --- Input/Output ---

  it('should have closeEvent output', () => {
    // Assert
    expect(component.closeEvent).toBeDefined();
  });
});

// END AI-generated - Following QuizApplication testing pattern
