
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormAgente } from '../../components/form-agente/form-agente';
import { Agente, UpdateAgenteRequest } from '../../interfaces/agente';
import { AgenteService } from '../../services/agente.service';

@Component({
  selector: 'app-update-agente',
  standalone: true,
  imports: [Back, PageHeader, FormAgente],
  templateUrl: './update-agente.html'
})
export class UpdateAgente implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private agenteService = inject(AgenteService);

  base = '/admin/agentes';
  section = 'Usuarios';
  agente = signal<Agente | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getAgente();
  }

  getAgente(): void {
    this.agenteService.getById(this.id).subscribe({
      next: (data) => this.agente.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el agente'), 'error');
        this.goToList();
      }
    });
  }

  updateAgente(data: UpdateAgenteRequest): void {
    this.saving.set(true);
    this.agenteService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Agente actualizado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar el agente'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
