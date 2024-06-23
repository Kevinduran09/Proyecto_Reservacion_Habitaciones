import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { room } from '../../models/rooms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
export interface ReservationForm {
  dateStart: string;
  dateEnd: string;
  typeRoom: string;
  minValue: number;
  maxValue: number;
}
@Component({
  selector: 'app-detail-reservation',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './detail-reservation.component.html',
  styleUrl: './detail-reservation.component.css'
})
export class DetailReservationComponent implements OnInit {
  room: room = {
    id: 0,
    nombre: '',
    descripcion: '',
    disponibilidad: '',
    precioNoche: 0,
    url: '',
    public_id: '',
    tipo_habitacion_id: 0,
    tipo_cama_id: 0,
    tipo_habitacion: {
      id: 0,
      tipoHabitacion: '',
      capacidad: 0
    },
    imagen: null,
    tipo_cama: {},
    servicios: []
  }
  roomSelections: any = [];
  identity!: User
  dataGroupDate!: ReservationForm

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) { }


  ngOnInit() {

    const datos = sessionStorage.getItem('rooms')

    if (datos) {
      this.roomSelections = JSON.parse(datos)
      console.log(this.roomSelections);

    } else {
      this.reservationService.currentReservationState.subscribe(state => {
        this.dataGroupDate = this.reservationService.getDataForm()
        console.log(this.dataGroupDate, state.roomSelections);
        
        this.roomSelections = state.roomSelections.filter(detail => detail.roomDetails);
        console.log(this.roomSelections);
        console.log(state);
        sessionStorage.setItem('rooms', JSON.stringify(this.roomSelections))
      });
    }

    this.loadUser()

  }
  async loadUser() {
    try {
      const res = await this.authService.getUserIdentity()

      this.identity = res.User
      console.log(this.identity);
    } catch (error) {

    }
  }
  clearAllRooms() {

  }

  removeRoom(index: number) {
    this.reservationService.removeRoomSelection(index);
  }

  finalizeReservation() {
    // Lógica para finalizar la reserva
  }
}
