// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

import { SocietyComponent } from './society.component';
import { SocietyService } from '../../../service/society.service';

// We test SocietyComponent because it handles:
// - Fetching and displaying societies
// - Creating and updating societies
// - Deleting societies with confirmation

describe('SocietyComponent', () => {
  let component: SocietyComponent;
  let fixture: ComponentFixture<SocietyComponent>;
  let mockSocietyService: jasmine.SpyObj<SocietyService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockSocieties = [
    { id: '1', name: 'Society 1', location: 'Location 1', pincode: '12345' }
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockSocietyService = jasmine.createSpyObj('SocietyService', ['fetchAllSociety', 'createSociety', 'updateSociety', 'deleteSociety']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values - component accesses res.data
    mockSocietyService.fetchAllSociety.and.returnValue(of({ data: mockSocieties } as any));

    await TestBed.configureTestingModule({
      imports: [SocietyComponent, FormsModule],
      providers: [
        { provide: SocietyService, useValue: mockSocietyService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SocietyComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create the society component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    // Assert
    expect(component.isLoading).toBeFalse();
  });

  it('should initialize with showModal as false', () => {
    // Assert
    expect(component.showModal).toBeFalse();
  });

  it('should initialize with isEditMode as false', () => {
    // Assert
    expect(component.isEditMode).toBeFalse();
  });

  it('should initialize with empty societies array', () => {
    // Assert
    expect(component.societies).toEqual([]);
  });

  // --- ngOnInit ---

  it('should call fetchAllSocieties on init', fakeAsync(() => {
    // Arrange
    spyOn(component, 'fetchAllSocieties').and.callThrough();

    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(component.fetchAllSocieties).toHaveBeenCalled();
  }));

  // --- fetchAllSocieties ---

  it('should fetch all societies', fakeAsync(() => {
    // Act
    component.fetchAllSocieties();
    tick();

    // Assert
    expect(mockSocietyService.fetchAllSociety).toHaveBeenCalled();
    expect(component.societies).toEqual(mockSocieties);
  }));

  it('should show error message when fetch fails', fakeAsync(() => {
    // Arrange
    mockSocietyService.fetchAllSociety.and.returnValue(throwError(() => new Error('Network error')));

    // Act
    component.fetchAllSocieties();
    tick();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error'
    }));
  }));

  // --- toggleModal ---

  it('should open modal in create mode', () => {
    // Act
    component.toggleModal(true);

    // Assert
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeFalse();
  });

  it('should open modal in edit mode with society data', () => {
    // Arrange
    const society = mockSocieties[0];

    // Act
    component.toggleModal(true, society);

    // Assert
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeTrue();
    expect(component.society.name).toBe('Society 1');
  });

  it('should close modal', () => {
    // Arrange
    component.showModal = true;

    // Act
    component.toggleModal(false);

    // Assert
    expect(component.showModal).toBeFalse();
  });
});

// END AI-generated - Following QuizApplication testing pattern
