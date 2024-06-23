import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedTypeComponent } from './bed-type.component';

describe('BedTypeComponent', () => {
  let component: BedTypeComponent;
  let fixture: ComponentFixture<BedTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BedTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
