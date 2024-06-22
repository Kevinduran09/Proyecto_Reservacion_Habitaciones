import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AdminService } from '../../../services/admin.service';
import { UserResponse } from '../../../models/user';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellidos', 'correo', 'nomUsuario', 'rol_id', 'Acciones'];
  public clientes!: Array<UserResponse>;
  dataSource!: MatTableDataSource<UserResponse>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service:AdminService) {

    this.loadClients();
  }

  async loadClients(){
    try{
      const res = await this.service.getClients();
      this.clientes = res;
      this.dataSource = new MatTableDataSource(this.clientes);
    }catch(error) {
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

  
}
