import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyRequestComponent } from './buy-request.component';

describe('BuyRequestComponent', () => {
  let component: BuyRequestComponent;
  let fixture: ComponentFixture<BuyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
