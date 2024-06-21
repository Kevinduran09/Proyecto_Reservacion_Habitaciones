import { Component, inject, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filterForm } from '../../../models/date';
import { MatSelectModule } from '@angular/material/select';
import { roomsService } from '../../../services/rooms.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { typeRoom } from '../../../models/rooms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { RoomCardComponent } from '../../room-card/room-card.component';
import { RoomSelectorComponent } from '../../rooms-selector/rooms-selector.component';

@Component({
  selector: 'app-form-rooms',
  standalone: true,
  imports: [RouterLink, MatIconModule, RoomSelectorComponent, RoomCardComponent, NgxSliderModule, MatFormFieldModule, MatSliderModule, MatIconModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, CommonModule, MatSelectModule, FontAwesomeModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
  providers: [provideNativeDateAdapter()],

})
export class RoomsComponent implements OnInit {

  isAuth: boolean
  roomDetails: any;
  formdata!: FormGroup;
  typesRooms!: typeRoom[]
  rooms!: []
  faPaperPlane = faPaperPlane
  minValue: number = 40;
  maxValue: number = 300;
  options: Options = {
    floor: 40,
    ceil: 300
  };
  constructor(private formBuilder: FormBuilder,
    private service: roomsService,
    private auth: AuthService,
    private swal: SweetAlertService,
    private router: Router
  ) {
    this.isAuth = false
  }


  async ngOnInit() {
    this.formdata = this.formBuilder.group({
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
      typeRoom: ['', Validators.required],
      minValue: [40, Validators.required],
      maxValue: [300, Validators.required],

    })

    this.formdata.get('confirmarNinos')?.valueChanges.subscribe((value) => {
      if (value === true) {
        this.formdata.get('ninos')?.enable();
      } else {
        this.formdata.get('ninos')?.disable();
      }
    });
    

    try {
      this.typesRooms = await this.service.getTypes()

      this.isAuth = await this.auth.getIndentityFromStorage()


    } catch (error) {
      console.error(error)
      this.swal.showAlert({ title: 'Error', text: 'No se pueden cargar tipos de habitaciones', icon: 'error' })
    }
  }
  handleRoomDataChange(event: any) {
    console.log('Datos de Room Selector:', event);
    // Aquí puedes manejar los datos recibidos del componente hijo
  }


  async onsubmit() {
    if (!this.isAuth) {
      this.swal.showAlert({
        text: 'Si desea buscar su habitación deseada, primero debe iniciar sesión',
        icon: 'warning',
      });
      return;
    }

    let data: filterForm = this.formdata.value as filterForm;
    const dateStart = new Date(data.dateStart);

    if (isNaN(dateStart.getTime()) || dateStart.getTime() <= Date.now()) {
      this.swal.showAlert({
        title: 'Fecha no válida',
        text: 'La fecha de inicio no puede ser igual o anterior a la fecha actual!',
        icon: 'error',
      });
      return;
    }

    const dateBegin = new Date(this.formdata.value.dateStart).toISOString().slice(0, 10);
    const dateEnd = new Date(this.formdata.value.dateEnd).toISOString().slice(0, 10);
    const typeRoom = this.formdata.value.typeRoom;
    const minValue = this.formdata.value.minValue;
    const maxValue = this.formdata.value.maxValue;

    try {
      this.rooms = await this.service.getFilterRooms({
        dateStart: dateBegin,
        dateEnd: dateEnd,
        typeRoom: typeRoom,
        minValue: minValue,
        maxValue: maxValue,
      });
      console.log(this.rooms);
      
      if (this.rooms.length === 0) {
        this.swal.showAlert({
          title: 'No se encontraron habitaciones',
          text: 'No hay habitaciones disponibles para los criterios de búsqueda seleccionados',
          icon: 'info',
        });
      }
    } catch (error) {
      console.error(error);
      this.swal.showAlert({
        title: 'Error',
        text: 'Hubo un error al buscar habitaciones',
        icon: 'error',
      });
    }
  }
}
// 