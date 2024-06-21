import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent implements OnInit {
  public rooms!: []
  constructor(private route: ActivatedRoute) {
    this.getRoomsByFilter()
  }
  ngOnInit(): void {

  }
  getRoomsByFilter() {
    this.route.queryParams.subscribe(params => {
      console.log('Date Start:', params['dateStart']);
      console.log('Date End:', params['dateEnd']);
      console.log('Type Room:', params['typeRoom']);
    });
  }
}
