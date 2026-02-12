// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoaderComponent } from './loader';

// We test LoaderComponent because it handles:
// - Displaying a loading indicator based on isLoading input

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the loader component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should accept isLoading input as true', () => {
    // Arrange
    component.isLoading = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isLoading).toBeTrue();
  });

  it('should accept isLoading input as false', () => {
    // Arrange
    component.isLoading = false;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isLoading).toBeFalse();
  });
});

// END AI-generated - Following QuizApplication testing pattern
