
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TableAgentes } from '../../components/table-agentes/table-agentes';
import { Agente } from '../../interfaces/agente';
import { TableAgentesEvents } from '../../interfaces/table-agentes';
import { AgenteService } from '../../services/agente.service';

@Component({
  selector: 'app-list-agentes',
  standalone: true,
  imports: [Button, PageHeader, TableAgentes],
  templateUrl: './list-agentes.html'
})
export class ListAgentes implements OnInit {

  private router = inject(Router);
  private agenteService = inject(AgenteService);
  private alertService = inject(AlertService);

  base = '/admin/agentes';
  section = 'Usuarios';
  subtitle = 'Agentes encargados de crear y gestionar eventos.';

  agentes = signal<Agente[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.agentes();
    return this.agentes().filter((item) =>
      [item.id_persona, item.identificacion, item.nombre_completo, item.correo, item.ciudad, item.telefonos, item.comision, item.experiencia].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-agente-button',
    title: 'Nuevo agente',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getAgentes();
  }

  getAgentes(): void {
    this.loading.set(true);
    this.agenteService.getAll().subscribe({
      next: (data) => {
        this.agentes.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar agentes'), 'error');
      }
    });
  }

  createAgente(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TableAgentesEvents): void {
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
      `¿Eliminar agente #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.agenteService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Agente eliminado correctamente', 'success');
        this.getAgentes();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar el agente'), 'error')
    });
  }

}
