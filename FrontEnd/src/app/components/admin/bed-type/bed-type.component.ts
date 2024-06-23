import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BedTypesAdminService } from '../../../services/bed-types-admin.service';
import { BedType } from '../../../models/bedType';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SweetAlertService } from '../../../services/sweet-alert.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-bed-type',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './bed-type.component.html',
  styleUrl: './bed-type.component.css'
})
export class BedTypeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'tipo', 'descripcion', 'acciones'];
  public tipoCamas!: Array<BedType>;
  dataSource!: MatTableDataSource<BedType>;

  public tipoCama = new BedType(null, '', '');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: BedTypesAdminService, private swal: SweetAlertService) {

  }

  ngOnInit() {
    this.loadBedTypes();
  }

  async loadBedTypes() {
    try {
      const res = await this.service.getBedTypes();
      this.tipoCamas = res;
      this.dataSource = new MatTableDataSource(this.tipoCamas);
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

  async deleteBedType(service: BedType): Promise<void> {
    if (await this.swal.showConfirm('Eliminar', `¿Estás seguro de que deseas eliminar el tipo de cama ${service.id}?`, 'warning')) {
      try {
        const response = await this.service.deleteBedType(service.id);
        this.swal.showToast('Se ha eliminado correctamente', 'success');
        this.loadBedTypes();
      } catch (error) {
        console.error(error);
      }
    }
  }
}
