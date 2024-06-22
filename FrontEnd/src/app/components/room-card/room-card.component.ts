import { Component, EventEmitter, Input, Output } from '@angular/core';
import { room } from '../../models/rooms';
import { faBed, faUser,faBellConcierge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule,RouterLink],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {
  faperson = faUser
  fabed=faBed
  faBellConcierge = faBellConcierge
  @Input() room!:room
  @Output() selectRoom = new EventEmitter<any>();


  constructor() { }

  onRoomSelected() {
    this.selectRoom.emit(this.room);  // Emitir el evento con el objeto de la habitación seleccionada
  }
}
