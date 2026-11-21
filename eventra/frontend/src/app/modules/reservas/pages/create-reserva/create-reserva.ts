
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormReserva } from '../../components/form-reserva/form-reserva';
import { CreateReservaRequest } from '../../interfaces/reserva';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-create-reserva',
  standalone: true,
  imports: [Back, PageHeader, FormReserva],
  templateUrl: './create-reserva.html'
})
export class CreateReserva {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private reservaService = inject(ReservaService);

  base = '/admin/reservas';
  section = 'Operación';

  saving = signal(false);

  createReserva(request: CreateReservaRequest): void {
    let data = request;
    this.saving.set(true);
    this.reservaService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Reserva registrada correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar la reserva'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
