import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReservationAdminService } from '../../../services/reservation-admin.service';
import { Reservation } from '../../../models/reservation';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SweetAlertService } from '../../../services/sweet-alert.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.css'
})
export class ReservacionComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'fechaIngreso', 'fechaSalida', 'estado', 'precioTotal', 'usuario_id', 'Acciones'];
  public reservations!: Array<Reservation>;
  dataSource!: MatTableDataSource<Reservation>;

  public reservation = new Reservation(0, '', '', '', 0, 0);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: ReservationAdminService, private swal: SweetAlertService) {
    this.loadReservations();
  }

  async loadReservations() {
    try {
      const res = await this.service.getReservations();
      this.reservations = res.reservaciones;
      this.dataSource = new MatTableDataSource(this.reservations);
    } catch (error) {
      console.error(error);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async deleteReservation(reservation: Reservation): Promise<void> {
    if (await this.swal.showConfirm('Eliminar',`¿Estás seguro de que deseas eliminar el usuario ${reservation.id}?`,'warning')) {
      try {
        const response =  this.service.deleteReservation(reservation.id)
        this.swal.showToast('Se ha eliminado correctamente','success')
        console.log(this.reservations);
        this.loadReservations();
      } catch (error) {
        console.error(error)
      }
    }
  }
}
