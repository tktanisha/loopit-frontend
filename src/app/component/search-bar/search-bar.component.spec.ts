// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchBarComponent } from './search-bar.component';

// We test SearchBarComponent because it handles:
// - Providing search input functionality

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the search-bar component', () => {
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
