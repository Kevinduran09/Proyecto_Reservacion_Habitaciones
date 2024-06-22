import { Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse,faRightFromBracket , faBars,faGear,faUser, faBed,faBook,faCopy,faBellConcierge} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
	imports: [FontAwesomeModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavbarComponent {
  faHouse = faHouse;
  faBars = faBars
  faGear = faGear
  faBed=faBed
  faUser=faUser
  faBook=faBook
  faCopy=faCopy
  faBellConcierge = faBellConcierge
  faRightFromBracket = faRightFromBracket
  constructor(private service:AuthService){}

  logout(){
    this.service.logout()
  }

}
