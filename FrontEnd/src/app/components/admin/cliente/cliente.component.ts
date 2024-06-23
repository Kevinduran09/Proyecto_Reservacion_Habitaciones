import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AdminService } from '../../../services/admin.service';
import { UserCreate, UserResponse } from '../../../models/user';
import { RouterLink } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { SweetAlertService } from '../../../services/sweet-alert.service';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellidos', 'correo', 'nomUsuario', 'rol_id', 'Acciones'];
  public clientes!: Array<UserResponse>;
  dataSource!: MatTableDataSource<UserResponse>;

public client = new UserCreate('','','','',null,'',''); 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service:AdminService, private swal: SweetAlertService) {

  }

  ngOnInit(){
    this.loadClients();
  }

  async loadClients(){
    try{
      const res = await this.service.getClients();
      this.clientes = res;
      this.dataSource = new MatTableDataSource(this.clientes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }catch(error) {
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

  async deleteUser(user: UserResponse): Promise<void> {
    if (await this.swal.showConfirm('Eliminar',`¿Estás seguro de que deseas eliminar el usuario ${user.nombre}?`,'warning')) {
      try {
        const response =  this.service.deleteClient(user.id)
        this.swal.showToast('Se ha eliminado correctamente','success')
        this.clientes = this.clientes.filter(d => d.id !== user.id);
        console.log(this.clientes);
        this.loadClients();
      } catch (error) {
        console.error(error)
      }
    }
  }
  
  
  // onSubmit() {
  //   try {
  //     this.service.createClient(this.client);
  //     this.loadClients();
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }



}
