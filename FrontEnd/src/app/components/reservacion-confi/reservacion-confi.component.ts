import { Component } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule, formatDate } from '@angular/common';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBed, faBellConcierge, faUser } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { ReservationAdminService } from '../../services/reservation-admin.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
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
  imports: [CommonModule, FontAwesomeModule,],
  templateUrl: './reservacion-confi.component.html',
  styleUrl: './reservacion-confi.component.css',
  providers: [DatePipe]
})

export class ReservacionConfiComponent {
  habitaciones:any = []
  roomSelections: any = [];
  identity!: User
  faperson = faUser
  fabed = faBed
  faBellConcierge = faBellConcierge
  dataGroupDate!: ReservationForm
  constructor(private reservationService: ReservationService, private datePipe: DatePipe,private authService: AuthService,
    private reservacionService: ReservationAdminService,
    private sweel:SweetAlertService,
    private router: Router
  ) { }

  ngOnInit() {

    
      this.reservationService.currentReservationState.subscribe(state => {
        this.dataGroupDate = this.reservationService.getDataForm()
        this.roomSelections = state.roomSelections.filter(detail => detail.roomDetails);
        console.log(this.roomSelections);
        console.log(state);
        console.log(this.dataGroupDate);

        sessionStorage.setItem('rooms', this.roomSelections)
      });
    

    this.loadUser()

  }
  calculartotalHabitaciones() {
    return `Cantidad todal de habitaciones: ${this.roomSelections.length}`
  }
  loadTotalCost() {
    let cost: number = 0;

    this.roomSelections.forEach((_roomDetails: {
      roomDetails: { id: any; precioNoche: number };
    }) => {
      
      this.habitaciones.push(_roomDetails.roomDetails.id);

      cost += _roomDetails.roomDetails.precioNoche;
    });

    console.log("Habitaciones procesadas:", this.habitaciones);
    console.log("Costo total:", cost);

    let startDate = new Date(this.dataGroupDate.dateStart);
    let endDate = new Date(this.dataGroupDate.dateEnd);
    let diffInMs = endDate.getTime() - startDate.getTime();
    let days = diffInMs / (1000 * 60 * 60 * 24);
    let roundedDays = Math.round(days);

    return cost * roundedDays
    
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

  async finalizeReservation() {
    const formData = new FormData();
    formData.append('fechaIngreso', this.datePipe.transform(new Date(this.dataGroupDate.dateStart), 'yyyy-MM-dd') ?? '');
    formData.append('fechaSalida', this.datePipe.transform(new Date(this.dataGroupDate.dateEnd), 'yyyy-MM-dd') ?? '');
    formData.append('estado', "Realizada");
    

    const sincopias = new Set(this.habitaciones);
    const habitaciones= [...sincopias];



    const formDataObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });


    formDataObject['habitaciones'] = JSON.stringify(habitaciones)
    console.log(formDataObject);
    
    try {
      const res = await this.reservacionService.createReservation(formDataObject)
      
      if(res){
        this.sweel.showAlert({text:'Se realizo la reservacion con exito!!!',icon:'success',timer:1300})
      
      }

    } catch (error) {
      console.error(error)
      this.sweel.showToast('No se pudo realizar la reservacion','error')

    } finally{
      this.router.navigate(['/home'])
    }


  }
}
