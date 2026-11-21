
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormAgente } from '../../components/form-agente/form-agente';
import { CreateAgenteRequest } from '../../interfaces/agente';
import { AgenteService } from '../../services/agente.service';

@Component({
  selector: 'app-create-agente',
  standalone: true,
  imports: [Back, PageHeader, FormAgente],
  templateUrl: './create-agente.html'
})
export class CreateAgente {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private agenteService = inject(AgenteService);

  base = '/admin/agentes';
  section = 'Usuarios';

  saving = signal(false);

  createAgente(request: CreateAgenteRequest): void {
    let data = request;
    this.saving.set(true);
    this.agenteService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Agente registrado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar el agente'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
