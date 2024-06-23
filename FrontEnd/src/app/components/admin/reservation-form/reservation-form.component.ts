import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../../models/reservation';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReservationAdminService } from '../../../services/reservation-admin.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit{
  faeyeslash = faEyeSlash
  faeye = faEye
  mostrarContrasena = false
  public reservation: Reservation = {
    id: null,
    fechaIngreso: '',
    fechaSalida: '',
    estado: '',
    precioTotal: null,
    usuario_id: null,
  };
  constructor(private service: ReservationAdminService, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']
    })
    try {
      const res = await this.service.getReservation(id);
      if (res.Reservation) {
        this.reservation = res.Reservation;
      }
      console.log(res)
    } catch (error) {
      console.error(error);
    }
  }

  onUpdate() {
    const formData = new FormData();

    // Añade cada propiedad verificando su tipo
    formData.append('id', this.reservation.id?.toString() ?? ''); // Maneja null con el operador ?? si es posible que id sea null
    formData.append('fechaIngreso', this.reservation.fechaIngreso);
    formData.append('fechaSalida', this.reservation.fechaSalida);
    formData.append('estado', this.reservation.estado);
    formData.append('precioTotal', this.reservation.precioTotal?.toString() ?? '');
    formData.append('usuario', this.reservation.usuario_id?.toString() ?? '');

    console.log(formData)
    try {
      this.service.updateReservation(this.reservation.id, formData);
    } catch (error) {
      console.error(error)
    }
  }

  onCreate() {
    const formData = new FormData();

    formData.append('fechaIngreso', this.reservation.fechaIngreso);
    formData.append('fechaSalida', this.reservation.fechaSalida);
    formData.append('estado', this.reservation.estado);
    formData.append('precioTotal', this.reservation.precioTotal?.toString() ?? '');
    formData.append('usuario', this.reservation.usuario_id?.toString() ?? '');

    console.log(formData)
    try {
      this.service.createReservation(formData);
    } catch (error) {
      console.error(error)
    }
  }

  onsubmit() {
    if (this.reservation.id != null) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }
}
