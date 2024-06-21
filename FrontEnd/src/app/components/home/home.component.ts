import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from "./hero/hero.component";
import { RoomsComponent } from "./habitaciones/rooms.component";
import { AboutComponent } from "./about/about.component";
import { FooterComponent } from "./footer/footer.component";
import { ServicesComponent } from './service/services-component';
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [HeaderComponent, HeroComponent, RoomsComponent, AboutComponent, ServicesComponent,FooterComponent]
})
export class HomeComponent {

}
