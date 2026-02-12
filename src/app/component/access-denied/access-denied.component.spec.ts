// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AccessDeniedComponent } from './access-denied.component';

// We test AccessDeniedComponent because it handles:
// - Displaying access denied message to unauthorized users

describe('AccessDeniedComponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessDeniedComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the access-denied component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should render without errors', () => {
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement).toBeTruthy();
  });
});

// END AI-generated - Following QuizApplication testing pattern
