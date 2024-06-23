import { Component, OnInit } from '@angular/core';
import { RoomType } from '../../../models/roomType';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomTypesAdminService } from '../../../services/room-types-admin.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-room-type-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './room-type-form.component.html',
  styleUrl: './room-type-form.component.css'
})
export class RoomTypeFormComponent implements OnInit {
  faeyeslash = faEyeSlash
  faeye = faEye
  public tipoDeHabitacion: RoomType = {
    id: null,
    tipoHabitacion: '',
    capacidad: null
  }

  constructor(private service: RoomTypesAdminService, private swal: SweetAlertService, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']

    })
    if (!isNaN(id)) {
      try {

        const res = await this.service.getRoomType(id);


        this.tipoDeHabitacion = res.tipoHabitacion;

        console.log(res)
      } catch (error) {
        console.error(error);
      }
    }

  }

  onUpdate() {
    try {
      this.service.updateRoomType(this.tipoDeHabitacion.id, this.tipoDeHabitacion);
      this.swal.showToast('Tipo de habiatción actualizado correctamente', 'success');
    } catch (error) {
      console.error(error)
    }
  }

  onCreate() {
    const formData = new FormData();

    // Añade cada propiedad verificando su tipo
    formData.append('tipoHabitacion', this.tipoDeHabitacion.tipoHabitacion);
    formData.append('capacidad', this.tipoDeHabitacion.capacidad?.toString() ?? '');

    console.log(formData)
    try {
      this.service.createRoomType(formData);
      this.swal.showToast('Tipo de habiatción creado correctamente', 'success');
    } catch (error) {
      console.error(error)
    }
  }

  onsubmit() {
    if (this.tipoDeHabitacion.id != null) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }
}
