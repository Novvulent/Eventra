
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormEvento } from '../../components/form-evento/form-evento';
import { CreateEventoRequest } from '../../interfaces/evento';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-create-evento',
  standalone: true,
  imports: [Back, PageHeader, FormEvento],
  templateUrl: './create-evento.html'
})
export class CreateEvento {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private eventoService = inject(EventoService);

  private auth = inject(AuthService);
  /** El agente solo registra y consulta eventos; el administrador tiene el CRUD completo. */
  esAgente = this.auth.usuario()?.rol === 'agente';
  base = this.esAgente ? '/agente/eventos' : '/admin/eventos';
  section = this.esAgente ? 'Panel del agente' : 'Operación';

  saving = signal(false);

  createEvento(request: CreateEventoRequest): void {
    let data = request;
    // El agente que registra el evento queda como responsable
    if (this.esAgente) data = { ...data, id_agente: this.auth.usuario()?.id_persona };
    this.saving.set(true);
    this.eventoService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Evento registrado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar el evento'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
