
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TableEventos } from '../../components/table-eventos/table-eventos';
import { Evento } from '../../interfaces/evento';
import { TableEventosEvents } from '../../interfaces/table-eventos';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-list-eventos',
  standalone: true,
  imports: [Button, PageHeader, TableEventos],
  templateUrl: './list-eventos.html'
})
export class ListEventos implements OnInit {

  private router = inject(Router);
  private eventoService = inject(EventoService);
  private alertService = inject(AlertService);

  private auth = inject(AuthService);
  /** El agente solo registra y consulta eventos; el administrador tiene el CRUD completo. */
  esAgente = this.auth.usuario()?.rol === 'agente';
  base = this.esAgente ? '/agente/eventos' : '/admin/eventos';
  section = this.esAgente ? 'Panel del agente' : 'Operación';
  canEdit = !this.esAgente;
  canDelete = !this.esAgente;
  subtitle = this.esAgente ? 'Registra nuevos eventos y consulta la cartelera completa.' : 'Funciones, teatros, fechas, capacidad y precios.';

  eventos = signal<Evento[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.eventos();
    return this.eventos().filter((item) =>
      [item.codigo_evento, item.nombre, item.teatro, item.ciudad, item.capacidad, item.estado, item.agente].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-evento-button',
    title: 'Nuevo evento',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos(): void {
    this.loading.set(true);
    this.eventoService.getAll().subscribe({
      next: (data) => {
        this.eventos.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar eventos'), 'error');
      }
    });
  }

  createEvento(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TableEventosEvents): void {
    switch (action) {
      case 'detail':
        this.viewDetail(id);
        break;
      case 'edit':
        this.update(id);
        break;
      case 'delete':
        this.delete(id);
        break;
    }
  }

  viewDetail(id: number): void {
    this.router.navigateByUrl(`${this.base}/detail/${id}`);
  }

  update(id: number): void {
    this.router.navigateByUrl(`${this.base}/update/${id}`);
  }

  async delete(id: number): Promise<void> {
    const confirm = await this.alertService.confirm(
      `¿Eliminar evento #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.eventoService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Evento eliminado correctamente', 'success');
        this.getEventos();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar el evento'), 'error')
    });
  }

}
