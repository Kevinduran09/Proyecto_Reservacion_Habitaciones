import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { SwalOptions } from '../models/swalOptions';
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  // Función para mostrar alertas simples con contenido personalizado
  showAlert(data: SwalOptions): Promise<SweetAlertResult> {
    return Swal.fire(data);
  }

  // Función para mostrar diálogos de confirmación
  async showConfirm(title: string, message: string, icon: 'warning' | 'error' | 'success' | 'info', confirmText = 'Sí, eliminarlo'): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }

  // Función para mostrar mensajes Toast
  showToast(message: string, icon: 'warning' | 'error' | 'success' | 'info'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon,
      title: message
    });
  }
}

