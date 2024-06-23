import { Component } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBed, faBellConcierge, faUser } from '@fortawesome/free-solid-svg-icons';

export interface ReservationForm {
  dateStart: string;
  dateEnd: string;
  typeRoom: string;
  minValue: number;
  maxValue: number;
}


@Component({
  selector: 'app-reservacion-confi',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './reservacion-confi.component.html',
  styleUrl: './reservacion-confi.component.css'
})

export class ReservacionConfiComponent {
  roomSelections:any = [];
  identity!:User
  faperson = faUser
  fabed = faBed
  faBellConcierge = faBellConcierge
  dataGroupDate!: ReservationForm
  constructor(private reservationService: ReservationService,private authService:AuthService) { }

  ngOnInit() {

    const datos = sessionStorage.getItem('rooms')
 
    if(datos){
      this.roomSelections = JSON.parse(datos)
      console.log(this.roomSelections);
      
    }else{
      this.reservationService.currentReservationState.subscribe(state => {
        this.dataGroupDate = this.reservationService.getDataForm()
        this.roomSelections = state.roomSelections.filter(detail => detail.roomDetails);
        console.log(this.roomSelections);
        console.log(state);
        sessionStorage.setItem('rooms', JSON.stringify(this.roomSelections))
      });
    }
    
      this.loadUser()
   
  }

  async loadUser(){
    try {
      const res = await this.authService.getUserIdentity()
    
      this.identity = res.User
      console.log(this.identity);
    } catch (error) {
      
    }
  }

  clearAllRooms(){

  }
  removeRoom(index: number) {
    this.reservationService.removeRoomSelection(index);
  }

  finalizeReservation() {
    // Lógica para finalizar la reserva
  }
}
