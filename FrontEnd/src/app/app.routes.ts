import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
import { AuthComponent } from './components/auth/auth.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { RoomsComponent } from './components/home/habitaciones/rooms.component';

import { HabitacionComponent } from './components/admin/habitacion/habitacion.component';
import { HabitacionFormComponent } from './components/habitacion-form/habitacion-form.component';

import { ClienteComponent } from './components/admin/cliente/cliente.component';
import { ClienteFormComponent } from './components/client-form/client-form.component';

import { ReservacionComponent } from './components/admin/reservacion/reservacion.component';
import { ReservationFormComponent } from './components/admin/reservation-form/reservation-form.component';
import { ReservacionConfiComponent } from './components/reservacion-confi/reservacion-confi.component';

import { ServicioComponent } from './components/admin/servicio/servicio.component';
import { ServicioFormComponent } from './components/admin/servicio-form/servicio-form.component';

import { RoomTypeComponent } from './components/admin/room-type/room-type.component';
import { RoomTypeFormComponent } from './components/admin/room-type-form/room-type-form.component';

import { BedTypeComponent } from './components/admin/bed-type/bed-type.component';
import { BedTypeFormComponent } from './components/admin/bed-type-form/bed-type-form.component';

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
        path: 'rooms', component: RoomsComponent
    },
    {
        path: 'confirm-reservation', component: ReservacionConfiComponent
    },
    {
        path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { expectedRol: 'admin' },
        children: [
            { path: 'cliente', component: ClienteComponent },
            { path: 'cliente-info/:id', component: ClienteFormComponent },

            { path: 'habitacion', component: HabitacionComponent },
            { path: 'habitacion-info/:id', component: HabitacionFormComponent},

            { path: 'reservacion', component: ReservacionComponent },
            { path: 'reservacion-info/:id', component: ReservationFormComponent },

            { path: 'servicio', component: ServicioComponent },
            { path: 'servicio-info/:id', component: ServicioFormComponent },

            { path: 'tipohabitacion', component: RoomTypeComponent},
            { path: 'tipohabitacion-info/:id', component: RoomTypeFormComponent},

            { path: 'tipocama', component: BedTypeComponent},
            { path: 'tipocama-info/:id', component: BedTypeFormComponent}
        ]
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
