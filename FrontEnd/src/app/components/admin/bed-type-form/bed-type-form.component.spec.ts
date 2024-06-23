import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedTypeFormComponent } from './bed-type-form.component';

describe('BedTypeFormComponent', () => {
  let component: BedTypeFormComponent;
  let fixture: ComponentFixture<BedTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedTypeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BedTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
