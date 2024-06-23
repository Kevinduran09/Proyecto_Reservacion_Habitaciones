import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  isAuth: boolean = false
  constructor(private service: AuthService,
    private swal: SweetAlertService,
    private router: Router) {
    this.getIndentity()
  }
  ngOnInit(): void {
    this.getIndentity()
  }

  async getIndentity() {
    const current = await this.service.getIndentityFromStorage()
    console.log(current);

    if (current) {
      this.isAuth = current ? true : false
      console.log(this.isAuth);

    }
  }


  onsubmit() {
    if (!this.isAuth) {
      this.swal.showAlert({
        text: 'Si desea buscar su habitación deseada, primero debe iniciar sesión',
        icon: 'warning',
      });
      return;
    }
    
    this.router.navigate(['/rooms'])
  }
}
