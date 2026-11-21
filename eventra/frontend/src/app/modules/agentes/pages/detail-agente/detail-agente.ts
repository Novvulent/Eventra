
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { Agente } from '../../interfaces/agente';
import { AgenteService } from '../../services/agente.service';

@Component({
  selector: 'app-detail-agente',
  standalone: true,
  imports: [Back, Button, PageHeader],
  templateUrl: './detail-agente.html'
})
export class DetailAgente implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private agenteService = inject(AgenteService);
  private alertService = inject(AlertService);

  base = '/admin/agentes';
  section = 'Usuarios';

  agente = signal<Agente | null>(null);

  editButtonConfig: ButtonConfig = {
    id: 'edit-agente-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getAgente(id);
  }

  getAgente(id: number): void {
    this.agenteService.getById(id).subscribe({
      next: (data) => this.agente.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el agente'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.agente();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_persona}`);
  }

}
