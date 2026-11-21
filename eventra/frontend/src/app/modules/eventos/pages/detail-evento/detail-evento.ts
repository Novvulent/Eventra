
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { badgeClass } from '../../../shared/utils/estado';
import { errorMessage } from '../../../shared/utils/http';
import { Evento } from '../../interfaces/evento';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-detail-evento',
  standalone: true,
  imports: [Back, Button, PageHeader, CurrencyPipe, DatePipe],
  templateUrl: './detail-evento.html'
})
export class DetailEvento implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private eventoService = inject(EventoService);
  private alertService = inject(AlertService);

  private auth = inject(AuthService);
  /** El agente solo registra y consulta eventos; el administrador tiene el CRUD completo. */
  esAgente = this.auth.usuario()?.rol === 'agente';
  base = this.esAgente ? '/agente/eventos' : '/admin/eventos';
  section = this.esAgente ? 'Panel del agente' : 'Operación';
  canEdit = !this.esAgente;
  canDelete = !this.esAgente;

  evento = signal<Evento | null>(null);
  badge = badgeClass;

  editButtonConfig: ButtonConfig = {
    id: 'edit-evento-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getEvento(id);
  }

  getEvento(id: number): void {
    this.eventoService.getById(id).subscribe({
      next: (data) => this.evento.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el evento'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.evento();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.codigo_evento}`);
  }

}
