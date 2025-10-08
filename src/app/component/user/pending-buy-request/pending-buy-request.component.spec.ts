import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBuyRequestComponent } from './pending-buy-request.component';

describe('PendingBuyRequestComponent', () => {
  let component: PendingBuyRequestComponent;
  let fixture: ComponentFixture<PendingBuyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingBuyRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingBuyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
