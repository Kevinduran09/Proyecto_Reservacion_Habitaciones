import { inject, runInInjectionContext } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SweetAlertService } from '../services/sweet-alert.service';

export const authGuard: CanActivateFn = (async (route, state) => {
    const authService = new AuthService();
    const router = new Router();
    const swal = new SweetAlertService()
    if (await authService.isAutenticated()) {
        return true;
    } else {
        swal.showToast('No posee la autorizacion para acceder al recurso', 'error')
        await router.navigate(['/home']);
        return false;
    }
});
