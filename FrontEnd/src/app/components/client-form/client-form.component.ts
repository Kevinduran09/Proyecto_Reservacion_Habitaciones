import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  faeyeslash = faEyeSlash
  faeye = faEye
  mostrarContrasena = false
  public client = new User(null, '', '', '', '', null, '', '', '', '', 0);
  public imagenRender: any
  constructor(private service: AdminService, private route: ActivatedRoute) {

  }


  async ngOnInit() {
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']
    })
    try {
      const res = await this.service.getClient(id);
      this.client = res.User;
      console.log(res)
    } catch (error) {
      console.error(error);
    }
  }

  toggleContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  onUpdate() {

    const formData = new FormData();

    // Añade cada propiedad verificando su tipo
    formData.append('id', this.client.id?.toString() ?? ''); // Maneja null con el operador ?? si es posible que id sea null
    formData.append('nombre', this.client.nombre);
    formData.append('apellidos', this.client.apellidos);
    formData.append('correo', this.client.correo);
    formData.append('cedula', this.client.cedula);
    formData.append('nomUsuario', this.client.nomUsuario);
    formData.append('contrasena', this.client.contrasena);
    formData.append('rol_id', this.client.rol_id?.toString() ?? '');

    // Para la imagen, verifica si está presente
    if (this.client.imagen) {
      formData.append('imagen', this.client.imagen);
    }

    console.log(formData)
    try {
      this.service.updateClient(this.client.id, formData);
    } catch (error) {
      console.error(error)
    }
  }


   onCreate() {
 const formData = new FormData();

    // Añade cada propiedad verificando su tipo
    formData.append('nombre', this.client.nombre);
    formData.append('apellidos', this.client.apellidos);
    formData.append('correo', this.client.correo);
    formData.append('cedula', this.client.cedula);
    formData.append('nomUsuario', this.client.nomUsuario);
    formData.append('contrasena', this.client.contrasena);
    formData.append('rol_id', this.client.rol_id?.toString() ?? '');

    // Para la imagen, verifica si está presente
    if (this.client.imagen) {
      formData.append('imagen', this.client.imagen);
    }

    console.log(formData)
    try {
      this.service.createClient( formData);
    } catch (error) {
      console.error(error)
    }
 }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      this.client.imagen = file
      console.log(this.client);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenRender = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onsubmit(){
    if (this.client.id !=null) {
      this.onUpdate();
    } else{
      this.onCreate();
    }
  }
}
