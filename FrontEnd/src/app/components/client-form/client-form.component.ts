import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { User, UserCreate, UserResponse } from '../../models/user';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink, FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClienteFormComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellidos', 'correo', 'nomUsuario', 'rol_id', 'Acciones'];
  public clientes!: Array<UserResponse>;
  dataSource!: MatTableDataSource<UserResponse>;

public client = new User(0,'','','','',null,'','','','',0); 

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

  onUpdate() {
    try {
      this.service.updateClient(this.client);
      this.loadClients();
    } catch (error) {
      console.error(error)
    }
  }


  onCreate() {
    try {
      this.service.updateClient(this.client);
      this.loadClients();
    } catch (error) {
      console.error(error)
    }
  }
}
