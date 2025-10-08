import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedAwaitingOrdersComponent } from './approved-awaiting-orders.component';

describe('ApprovedAwaitingOrdersComponent', () => {
  let component: ApprovedAwaitingOrdersComponent;
  let fixture: ComponentFixture<ApprovedAwaitingOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedAwaitingOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedAwaitingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
