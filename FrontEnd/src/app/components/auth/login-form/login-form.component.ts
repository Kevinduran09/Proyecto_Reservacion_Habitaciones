import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserLogin } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { SweetAlertService } from '../../../services/sweet-alert.service';
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  isLogging: boolean = false;
  constructor(private formBuilder: FormBuilder, private servicio: AuthService, private swal: SweetAlertService, private router: Router) {
  }

  get nomUsuario() {
    return this.loginForm.get('nomUsuario') as FormControl;
  }
  get contrasena() {
    return this.loginForm.get('contrasena') as FormControl;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      nomUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  async onSubmit() {

    if (this.loginForm?.valid) {
      this.isLogging = true
      const user: UserLogin = this.loginForm.value as UserLogin;
      try {
        const response = await this.servicio.login(user);
       
        
        sessionStorage.setItem('token', response.token)
        this.isLogging = false
        const res = await this.servicio.getIndentityFromAPI();
 
       
        sessionStorage.setItem('current',JSON.stringify(res))
       
        if (res.rol == 'admin') {
          this.router.navigate(["/admin"])
        } else if (res.rol == "usuario") {
         
          this.router.navigate(["/home"])
        }
      } catch (error: any) {
        this.isLogging = false
        console.log(error);
        this.swal.showAlert({
          title:'Denegado',
          text: error.response.data.error,
          icon:'error',
          timer:1200
        })
      }


    }
  }
}
