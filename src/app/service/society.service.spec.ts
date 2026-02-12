// BEGIN AI-generated - Following QuizApplication testing pattern

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { SocietyService } from './society.service';
import { SocietyPayload } from '../models/society';

// We test SocietyService because it handles:
// - Creating societies
// - Fetching all societies
// - Updating societies
// - Deleting societies

describe('SocietyService', () => {
  let service: SocietyService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const ApiUrl = 'http://127.0.0.1:8000';

  const mockSociety: SocietyPayload = {
    name: 'Test Society',
    location: 'Test Location',
    pincode: '12345'
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SocietyService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(SocietyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- Basic instantiation ---

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  // --- createSociety ---

  it('should create a society with POST request', () => {
    // Act
    service.createSociety(mockSociety).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/societies`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSociety);
    req.flush(mockSociety);
  });

  // --- fetchAllSociety ---

  it('should fetch all societies with GET request', () => {
    // Arrange
    const mockResponse = {
      data: [mockSociety]
    };

    // Act
    service.fetchAllSociety().subscribe(data => {
      // Assert
      expect(data).toEqual([mockSociety]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/societies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle empty society list', () => {
    // Arrange
    const mockResponse = {
      data: []
    };

    // Act
    service.fetchAllSociety().subscribe(data => {
      // Assert
      expect(data).toEqual([]);
    });

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/societies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // --- updateSociety ---

  it('should update society with PUT request', () => {
    // Arrange
    const societyId = '123';

    // Act
    service.updateSociety(societyId, mockSociety).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/societies/${societyId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSociety);
    req.flush({ success: true });
  });

  // --- deleteSociety ---

  it('should delete society with DELETE request', () => {
    // Arrange
    const societyId = '123';

    // Act
    service.deleteSociety(societyId).subscribe();

    // Assert - verify HTTP request
    const req = httpMock.expectOne(`${ApiUrl}/societies/${societyId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});

// END AI-generated - Following QuizApplication testing pattern
