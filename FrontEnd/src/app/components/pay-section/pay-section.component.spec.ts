import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySectionComponent } from './pay-section.component';

describe('PaySectionComponent', () => {
  let component: PaySectionComponent;
  let fixture: ComponentFixture<PaySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaySectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
