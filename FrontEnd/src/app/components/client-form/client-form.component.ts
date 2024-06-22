import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { User, UserCreate, UserResponse } from '../../models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
export class ClienteFormComponent implements OnInit{

public client = new User(0,'','','','',null,'','','','',0); 

  constructor(private service:AdminService, private route:ActivatedRoute) {

  }


  async ngOnInit(){
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']
    })
    try{
      const res = await this.service.getClient(id);
      this.client = res;
      console.log(res)
    }catch(error) {
      console.error(error);
    }
  }

  onUpdate() {
    console.log(this.client)
    try {
      this.service.updateClient(this.client);
    } catch (error) {
      console.error(error)
    }
  }


  onCreate() {
    try {
      this.service.updateClient(this.client);
    } catch (error) {
      console.error(error)
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.client.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
