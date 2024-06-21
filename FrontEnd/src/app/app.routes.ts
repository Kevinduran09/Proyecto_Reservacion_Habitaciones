import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';

import { authGuard } from './guards/auth.guard';
import { rolGuard } from './guards/rol.guard';
import { roomsService } from './services/rooms.service';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            { path: 'login', component: LoginFormComponent },
            { path: 'register', component: RegisterFormComponent },
            { path: '**', redirectTo: 'login' } // Redirige a login si la ruta no es reconocida
        ]
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'rooms', component: HabitacionesComponent
    },

    {
        path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { expectedRol: 'admin' } // espera un rol admin
    },
    {
        path: '',
        redirectTo: '/home', // Redirige al login por defecto
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/home' // Redirige al login si la ruta no es reconocida
    }
];
