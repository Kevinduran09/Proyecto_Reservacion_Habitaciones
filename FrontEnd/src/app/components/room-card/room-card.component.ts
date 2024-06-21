import { Component, Input } from '@angular/core';
import { room } from '../../models/rooms';
import { faBed, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {
  faperson = faUser
  fabed=faBed
  @Input() room!:room
}
