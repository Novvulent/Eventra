
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TablePersonas } from '../../components/table-personas/table-personas';
import { Persona } from '../../interfaces/persona';
import { TablePersonasEvents } from '../../interfaces/table-personas';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-list-personas',
  standalone: true,
  imports: [Button, PageHeader, TablePersonas],
  templateUrl: './list-personas.html'
})
export class ListPersonas implements OnInit {

  private router = inject(Router);
  private personaService = inject(PersonaService);
  private alertService = inject(AlertService);

  base = '/admin/personas';
  section = 'Usuarios';
  subtitle = 'Datos básicos de todas las personas del sistema.';

  personas = signal<Persona[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.personas();
    return this.personas().filter((item) =>
      [item.id_persona, item.identificacion, item.nombre_completo, item.correo, item.ciudad, item.telefonos, item.rol].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-persona-button',
    title: 'Nueva persona',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getPersonas();
  }

  getPersonas(): void {
    this.loading.set(true);
    this.personaService.getAll().subscribe({
      next: (data) => {
        this.personas.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar personas'), 'error');
      }
    });
  }

  createPersona(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TablePersonasEvents): void {
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
      `¿Eliminar persona #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.personaService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Persona eliminada correctamente', 'success');
        this.getPersonas();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar la persona'), 'error')
    });
  }

}
