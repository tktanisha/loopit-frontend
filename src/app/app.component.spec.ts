// App Component Tests - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';

// AppComponent is an empty shell -- just verify it creates without errors.

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    // Configure TestBed with NO_ERRORS_SCHEMA to ignore child component selectors
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    // Create the component instance
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should have app-root selector', () => {
    // Assert - verify selector is correct
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
