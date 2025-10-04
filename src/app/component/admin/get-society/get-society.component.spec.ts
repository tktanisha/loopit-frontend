import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSocietyComponent } from './get-society.component';

describe('GetSocietyComponent', () => {
  let component: GetSocietyComponent;
  let fixture: ComponentFixture<GetSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSocietyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
