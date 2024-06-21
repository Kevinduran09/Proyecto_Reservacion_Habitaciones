import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SweetAlertService } from '../services/sweet-alert.service';

export const rolGuard: CanActivateFn = async (route, state) => {
  const authService = new AuthService();
  const expectedRol = route.data['expectedRol'];
  const identity = await authService.getIndentityFromStorage()
  const swal = new SweetAlertService()
  console.log(identity);
  
  if (identity.rol == expectedRol){
    return true
  }else{
    swal.showToast('No posee la autorizacion para acceder al recurso','error')
    
    return false
  }
};
