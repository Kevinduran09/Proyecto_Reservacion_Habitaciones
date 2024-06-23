import { Component, OnInit } from '@angular/core';
import { room, typeBed, typeRoom } from '../../models/rooms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { roomsService } from '../../services/rooms.service';

@Component({
  selector: 'app-habitacion-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './habitacion-form.component.html',
  styleUrls: ['./habitacion-form.component.css'] // Corrección de 'styleUrl' a 'styleUrls'
})
export class HabitacionFormComponent implements OnInit { // Implementar OnInit
  public Room: room = {
    id: null,
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
    tipo_cama: {
      id: 0,
      tipo: '',
      descripcion: ''
    },
    servicios: [],
    imagen: null
  }

  public tipoHabitaciones: any[] = [];
  public tipoCamas: any[] = [];

  public imagenRender: any;
  constructor(private service: roomsService, private route: ActivatedRoute) { }

  onCreate() {
    const formData = new FormData();

    formData.append('nombre', this.Room.nombre);
    formData.append('descripcion', this.Room.descripcion);
    formData.append('disponibilidad', this.Room.disponibilidad);
    formData.append('precioNoche', this.Room.precioNoche?.toString() ?? '');
    formData.append('url', this.Room.url);
    formData.append('public_id', this.Room.tipo_habitacion?.toString() ?? '');
    formData.append('tipo_habitacion_id', this.Room.tipo_habitacion_id?.toString() ?? '');
    formData.append('tipo_cama_id', this.Room.tipo_cama_id?.toString() ?? '');

    if (this.Room.imagen) {
      formData.append('imagen', this.Room.imagen);
    }

    console.log(formData)
    try {
      this.service.createRoom(formData);
    } catch (error) {
      console.error(error)
    }
  }

  onUpdate() {
    const formData = new FormData();

    formData.append('nombre', this.Room.nombre);
    formData.append('descripcion', this.Room.descripcion);
    formData.append('disponibilidad', this.Room.disponibilidad);
    formData.append('precioNoche', this.Room.precioNoche?.toString() ?? '');
    formData.append('url', this.Room.url);
    formData.append('public_id', this.Room.public_id?.toString() ?? '');
    formData.append('tipo_habitacion_id', this.Room.tipo_habitacion_id?.toString() ?? '');
    formData.append('tipo_cama_id', this.Room.tipo_cama_id?.toString() ?? '');

    if (this.Room.imagen) {
      formData.append('imagen', this.Room.imagen);
    }

    console.log(formData)
    try {
      this.service.updateRoom(this.Room.id, formData);
    } catch (error) {
      console.error(error)
    }
  }

  onsubmit() {
    if (this.Room.id != null) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      this.Room.imagen = file
      console.log(this.Room);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenRender = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async ngOnInit() {
    let id: number = 0
    this.route.params.subscribe(params => {
      id = params['id']

    })
    if (!isNaN(id)) {
      try {

        const res = await this.service.getRoom(id);

        this.Room = res.habitacion;

        console.log(res.habitacion)
      } catch (error) {
        console.error(error);
      }
    }

    try {

      this.tipoHabitaciones = await this.service.getTipoHabitaciones();
      this.tipoCamas = await this.service.getTipoCamas();
      console.log(this.tipoHabitaciones, this.tipoCamas)
    } catch (error) {
      console.error(error);
    }
  }
}
