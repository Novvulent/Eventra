import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/** Confirmaciones y notificaciones (SweetAlert2) con los colores de Eventra. */
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Confirmación de acciones (ej. eliminar)
  confirm(title: string, text: string, confirmButtonText = 'Sí, eliminar'): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c93a32',
      cancelButtonColor: '#6b6478',
      confirmButtonText,
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => result.isConfirmed);
  }

  // Solicita un texto obligatorio (ej. causa de cancelación). Devuelve null si se cancela.
  prompt(title: string, label: string, placeholder = ''): Promise<string | null> {
    return Swal.fire({
      title,
      input: 'textarea',
      inputLabel: label,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonColor: '#b8234f',
      cancelButtonColor: '#6b6478',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      reverseButtons: true,
      inputValidator: (value) => (!value?.trim() ? 'Este campo es obligatorio' : null)
    }).then((result) => (result.isConfirmed ? String(result.value).trim() : null));
  }

  // Notificación tipo Toast
  toast(message: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
}
