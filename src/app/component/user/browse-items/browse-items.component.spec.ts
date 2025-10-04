import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseItemsComponent } from './browse-items.component';

describe('BrowseItemsComponent', () => {
  let component: BrowseItemsComponent;
  let fixture: ComponentFixture<BrowseItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
