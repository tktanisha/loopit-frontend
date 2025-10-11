import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyComponent } from './society.component';

describe('CreateSocietyComponent', () => {
  let component: SocietyComponent;
  let fixture: ComponentFixture<SocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
