import { Component, OnInit } from '@angular/core';
import { Service } from '../../../models/service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServiceAdminService } from '../../../services/service-admin.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './servicio-form.component.html',
  styleUrl: './servicio-form.component.css'
})
export class ServicioFormComponent implements OnInit {
  faeyeslash = faEyeSlash
  faeye = faEye
  public servicio: Service = {
    id: null,
    nombre: '',
    descripcion: '',
    costo: null,
    activo: ''
  }

  constructor(private service: ServiceAdminService, private swal: SweetAlertService ,private route: ActivatedRoute) {
    
  }

  async ngOnInit() {
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']
    })
    try {
      const res = await this.service.getService(id);
      if (res) {
        this.servicio = res;
      }
      console.log(res)
    } catch (error) {
      console.error(error);
    }
  }

  onUpdate() {

    const formData = new FormData();

    // Añade cada propiedad verificando su tipo
    formData.append('id', this.servicio.id?.toString() ?? ''); // Maneja null con el operador ?? si es posible que id sea null
    formData.append('nombre', this.servicio.nombre);
    formData.append('descripcion', this.servicio.descripcion);
    formData.append('costo', this.servicio.costo?.toString() ?? '');
    formData.append('estado', this.servicio.activo);

    console.log(formData)
    try {
      this.service.updateService(this.servicio.id, formData);
      this.swal.showToast('Servicio actualizado correctamente', 'success');
    } catch (error) {
      console.error(error)
    }
  }


  onCreate() {
    const formData = new FormData();

    // Añade cada propiedad verificando su tipo
    formData.append('nombre', this.servicio.nombre);
    formData.append('descripcion', this.servicio.descripcion);
    formData.append('costo', this.servicio.costo?.toString() ?? '');
    formData.append('activo', this.servicio.activo);

    console.log(formData)
    try {
      this.service.createService(formData);
      this.swal.showToast('Servicio creado correctamente', 'success');
    } catch (error) {
      console.error(error)
    }
  }

  onsubmit() {
    if (this.servicio.id != null) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }
}
