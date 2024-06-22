import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionFormComponent } from './habitacion-form.component';

describe('HabitacionFormComponent', () => {
  let component: HabitacionFormComponent;
  let fixture: ComponentFixture<HabitacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitacionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HabitacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
