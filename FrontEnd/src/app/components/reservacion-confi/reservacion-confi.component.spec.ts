import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionConfiComponent } from './reservacion-confi.component';

describe('ReservacionConfiComponent', () => {
  let component: ReservacionConfiComponent;
  let fixture: ComponentFixture<ReservacionConfiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservacionConfiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservacionConfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
