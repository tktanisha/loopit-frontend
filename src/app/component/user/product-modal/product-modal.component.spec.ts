// BEGIN AI-generated - Following QuizApplication testing pattern

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ProductModalComponent } from './product-modal.component';
import { BuyRequestService } from '../../../service/buy-request.service';

// We test ProductModalComponent because it handles:
// - Displaying product details in a modal
// - Sending buy requests

describe('ProductModalComponent', () => {
  let component: ProductModalComponent;
  let fixture: ComponentFixture<ProductModalComponent>;
  let mockBuyRequestService: jasmine.SpyObj<BuyRequestService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockBuyRequestService = jasmine.createSpyObj('BuyRequestService', ['createRequest']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    // Setup default return values
    mockBuyRequestService.createRequest.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [ProductModalComponent],
      providers: [
        { provide: BuyRequestService, useValue: mockBuyRequestService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductModalComponent);
    component = fixture.componentInstance;
  });

  // --- Basic instantiation ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// END AI-generated - Following QuizApplication testing pattern