
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormReserva } from '../../components/form-reserva/form-reserva';
import { Reserva, UpdateReservaRequest } from '../../interfaces/reserva';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-update-reserva',
  standalone: true,
  imports: [Back, PageHeader, FormReserva],
  templateUrl: './update-reserva.html'
})
export class UpdateReserva implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private reservaService = inject(ReservaService);

  base = '/admin/reservas';
  section = 'Operación';
  reserva = signal<Reserva | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getReserva();
  }

  getReserva(): void {
    this.reservaService.getById(this.id).subscribe({
      next: (data) => this.reserva.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar la reserva'), 'error');
        this.goToList();
      }
    });
  }

  updateReserva(data: UpdateReservaRequest): void {
    this.saving.set(true);
    this.reservaService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Reserva actualizada correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar la reserva'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
