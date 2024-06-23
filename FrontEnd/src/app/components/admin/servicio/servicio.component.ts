import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServiceAdminService } from '../../../services/service-admin.service';
import { Service } from '../../../models/service';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SweetAlertService } from '../../../services/sweet-alert.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'costo', 'activo', 'acciones'];
  public servicios!: Array<Service>;
  dataSource!: MatTableDataSource<Service>;

  public servicio = new Service(null, '', '', null, '');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: ServiceAdminService, private swal: SweetAlertService) {

  }

  ngOnInit() {
    this.loadServices();
  }

  async loadServices() {
    try {
      const res = await this.service.getServices();
      this.servicios = res;
      this.dataSource = new MatTableDataSource(this.servicios);
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

  async deleteService(service: Service): Promise<void> {
    if (await this.swal.showConfirm('Eliminar', `¿Estás seguro de que deseas eliminar el usuario ${service.nombre}?`, 'warning')) {
      try {
        const response = await this.service.deleteService(service.id);
        this.swal.showToast('Se ha eliminado correctamente', 'success');
        this.loadServices();
      } catch (error) {
        console.error(error);
      }
    }
  }
}