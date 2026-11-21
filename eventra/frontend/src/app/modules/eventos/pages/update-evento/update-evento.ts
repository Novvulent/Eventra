
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormEvento } from '../../components/form-evento/form-evento';
import { Evento, UpdateEventoRequest } from '../../interfaces/evento';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-update-evento',
  standalone: true,
  imports: [Back, PageHeader, FormEvento],
  templateUrl: './update-evento.html'
})
export class UpdateEvento implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private eventoService = inject(EventoService);

  base = '/admin/eventos';
  section = 'Operación';
  evento = signal<Evento | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getEvento();
  }

  getEvento(): void {
    this.eventoService.getById(this.id).subscribe({
      next: (data) => this.evento.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el evento'), 'error');
        this.goToList();
      }
    });
  }

  updateEvento(data: UpdateEventoRequest): void {
    this.saving.set(true);
    this.eventoService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Evento actualizado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar el evento'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
