
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { badgeClass } from '../../../shared/utils/estado';
import { errorMessage } from '../../../shared/utils/http';
import { Reserva } from '../../interfaces/reserva';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-detail-reserva',
  standalone: true,
  imports: [Back, Button, PageHeader, CurrencyPipe, DatePipe],
  templateUrl: './detail-reserva.html'
})
export class DetailReserva implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private reservaService = inject(ReservaService);
  private alertService = inject(AlertService);

  base = '/admin/reservas';
  section = 'Operación';

  reserva = signal<Reserva | null>(null);
  badge = badgeClass;

  editButtonConfig: ButtonConfig = {
    id: 'edit-reserva-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getReserva(id);
  }

  getReserva(id: number): void {
    this.reservaService.getById(id).subscribe({
      next: (data) => this.reserva.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar la reserva'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.reserva();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_reserva}`);
  }

}
