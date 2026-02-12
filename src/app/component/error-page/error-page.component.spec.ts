// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ErrorPageComponent } from './error-page.component';

// We test ErrorPageComponent because it handles:
// - Displaying error message for 404 or other errors

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the error-page component', () => {
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
