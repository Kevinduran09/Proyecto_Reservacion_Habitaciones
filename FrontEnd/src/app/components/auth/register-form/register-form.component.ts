import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { UserCreate, UserResponse } from '../../../models/user';
@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  isregister: boolean = false;
  constructor(private formBuilder: FormBuilder, private servicio: AuthService, private swal: SweetAlertService, private router: Router) {
  }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required,Validators.email]],
      cedula:['',Validators.required],
      nomUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })

  }

  async onSubmit() {
    if (this.registerForm?.valid) {
     this.isregister = true
     const user:UserCreate = this.registerForm.value as UserCreate;

     try {
      const res = await this.servicio.register(user);
        this.swal.showAlert({text:'Exito',title:'Se registro su usuario con exito, inicie sesion para continuar',icon:'success',timer:1200})
        this.registerForm.reset()
      this.isregister=false
     } catch (error) {
      console.log(error);
       this.isregister = false
     }
     
    }


  }
}
