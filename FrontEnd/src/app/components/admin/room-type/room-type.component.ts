import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RoomTypesAdminService } from '../../../services/room-types-admin.service';
import { RoomType } from '../../../models/roomType';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SweetAlertService } from '../../../services/sweet-alert.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-room-type',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './room-type.component.html',
  styleUrl: './room-type.component.css'
})
export class RoomTypeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'tipoHabitacion', 'capacidad', 'acciones'];
  public tipoHabitaciones!: Array<RoomType>;
  dataSource!: MatTableDataSource<RoomType>;

  public tipoHabitacion = new RoomType(null, '', null);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: RoomTypesAdminService, private swal: SweetAlertService) {

  }

  ngOnInit() {
    this.loadRoomTypes();
  }

  async loadRoomTypes() {
    try {
      const res = await this.service.getRoomTypes();
      this.tipoHabitaciones = res;
      this.dataSource = new MatTableDataSource(this.tipoHabitaciones);
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

  async deleteRoomType(service: RoomType): Promise<void> {
    if (await this.swal.showConfirm('Eliminar', `¿Estás seguro de que deseas eliminar el tipo de habitación ${service.id}?`, 'warning')) {
      try {
        const response = await this.service.deleteRoomType(service.id);
        this.swal.showToast('Se ha eliminado correctamente', 'success');
        this.loadRoomTypes();
      } catch (error) {
        console.error(error);
      }
    }
  }

}
