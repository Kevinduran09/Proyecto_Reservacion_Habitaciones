import { Component, OnInit } from '@angular/core';
import { BedType } from '../../../models/bedType';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BedTypesAdminService } from '../../../services/bed-types-admin.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-bed-type-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './bed-type-form.component.html',
  styleUrl: './bed-type-form.component.css'
})
export class BedTypeFormComponent implements OnInit {
  faeyeslash = faEyeSlash
  faeye = faEye
  public tipoCama: BedType = {
    id: null,
    tipo: '',
    descripcion: ''
  }

  constructor(private service: BedTypesAdminService, private swal: SweetAlertService, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']

    })
    if (!isNaN(id)) {
      try {

        const res = await this.service.getBedType(id);


        this.tipoCama = res;

        console.log(res)
      } catch (error) {
        console.error(error);
      }
    }

  }

  onUpdate() {
    try {
      this.service.updateBedType(this.tipoCama.id, this.tipoCama);
      this.swal.showToast('Tipo de cama actualizada correctamente', 'success');
    } catch (error) {
      console.error(error)
    }
  }

  onCreate() {
    const formData = new FormData();

    // Añade cada propiedad verificando su tipo
    formData.append('tipo', this.tipoCama.tipo);
    formData.append('descripcion', this.tipoCama.descripcion?.toString() ?? '');

    console.log(formData)
    try {
      this.service.createBedType(formData);
      this.swal.showToast('Tipo de cama creada correctamente', 'success');
    } catch (error) {
      console.error(error)
    }
  }

  onsubmit() {
    if (this.tipoCama.id != null) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }
}
