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
import { typeRoom } from '../../../models/typeroom';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-form-rooms',
  standalone: true,
  imports: [RouterLink, MatFormFieldModule, MatIconModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, CommonModule, MatSelectModule, FontAwesomeModule],
  templateUrl: './form-rooms.component.html',
  styleUrl: './form-rooms.component.css',
  providers: [provideNativeDateAdapter()],
})
export class FormRoomsComponent implements OnInit {
  isAuth: boolean
  formdata!: FormGroup;
  typesRooms!: typeRoom[]
  faPaperPlane = faPaperPlane
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
      habitaciones: [null, Validators.required],
      typeRoom: ['',Validators.required],
      adultos: ['1', Validators.required],
      confirmarNinos: [false, Validators.required],
      ninos: [{ value: '', disabled: true }, Validators.required]
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


  onsubmit() {
    if (!!!this.isAuth) {
      this.swal.showAlert({ text: 'Si desea buscar su habitacion deseada primero debe inicar sesion', icon: 'warning' })
      return
    }
    let data: filterForm = this.formdata.value as filterForm
    const dateStart = new Date(data.dateStart);

    if (isNaN(dateStart.getTime()) || dateStart.getTime() <= Date.now()) {
      this.swal.showAlert({ title: 'Fecha no válida', text: 'La fecha de inicio no puede ser igual o anterior a la fecha actual!', icon: 'error' });
      return;
    }
    console.log(data.dateStart.toISOString().slice(0, 10));
    console.log(data);
    const dateBegin = new Date(this.formdata.value.dateStart).toISOString().slice(0, 10);
    const dateEnd = new Date(this.formdata.value.dateEnd).toISOString().slice(0, 10);
    const typeRoom = this.formdata.value.typeRoom;

    this.router.navigate(['/rooms'], {
      queryParams: {
        dateStart: dateBegin,
        dateEnd: dateEnd,
        typeRoom: typeRoom
      }
    });
  }
}
