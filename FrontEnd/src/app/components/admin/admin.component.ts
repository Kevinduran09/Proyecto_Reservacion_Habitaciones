import { Component } from '@angular/core';
import { NavbarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
