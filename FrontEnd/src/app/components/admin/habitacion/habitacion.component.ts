import { Component, OnInit } from '@angular/core';
import { room } from '../../../models/rooms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { roomsService } from '../../../services/rooms.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-habitacion',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './habitacion.component.html',
  styleUrl: './habitacion.component.css'
})
export class HabitacionComponent implements OnInit{
  faeyeslash = faEyeSlash
  faeye = faEye
  mostrarContrasena = false
  public Room!:room[];
  public imagenRender: any
  dataSource!: MatTableDataSource<room>;
displayedColumns: any;
  constructor(private service: roomsService, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']
    })
    try {
      const res = await this.service.getRoom(id);
      this.Room = res.User;
      console.log(res)
    } catch (error) {
      console.error(error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
