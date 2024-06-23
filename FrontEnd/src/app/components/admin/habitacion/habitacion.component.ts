import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { room } from '../../../models/rooms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { roomsService } from '../../../services/rooms.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-habitacion',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './habitacion.component.html',
  styleUrl: './habitacion.component.css'
})
export class HabitacionComponent implements AfterViewInit, OnInit {
  faeyeslash = faEyeSlash
  faeye = faEye
  mostrarContrasena = false
  public Room!: room[];
  public imagenRender: any
  dataSource!: MatTableDataSource<room>;
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'disponibilidad', 'precioNoche', 'url', 'tipo_habitacion_id', 'tipo_cama_id', 'acciones'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private service: roomsService, private route: ActivatedRoute, private swal: SweetAlertService) {

  }

  ngOnInit() {
    this.loadHabitacion();
  }

  async loadHabitacion() {
    try {
      const res = await this.service.getRooms();
      this.Room = res;
      this.dataSource = new MatTableDataSource(this.Room);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error(error);
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async deleteUser(room: room): Promise<void> {
    if (await this.swal.showConfirm('Eliminar', `¿Estás seguro de que deseas eliminar la habitacion ${room.nombre}?`, 'warning')) {
      try {
        const response = this.service.deleteRoom(room.id)
        this.swal.showToast('Se ha eliminado correctamente', 'success')
        this.Room = this.Room.filter(d => d.id !== room.id);
        console.log(this.Room);
        this.Room;
      } catch (error) {
        console.error(error)
      }
    }
  }
}
