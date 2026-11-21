
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormPersona } from '../../components/form-persona/form-persona';
import { Persona, UpdatePersonaRequest } from '../../interfaces/persona';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-update-persona',
  standalone: true,
  imports: [Back, PageHeader, FormPersona],
  templateUrl: './update-persona.html'
})
export class UpdatePersona implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private personaService = inject(PersonaService);

  base = '/admin/personas';
  section = 'Usuarios';
  persona = signal<Persona | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getPersona();
  }

  getPersona(): void {
    this.personaService.getById(this.id).subscribe({
      next: (data) => this.persona.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar la persona'), 'error');
        this.goToList();
      }
    });
  }

  updatePersona(data: UpdatePersonaRequest): void {
    this.saving.set(true);
    this.personaService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Persona actualizada correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar la persona'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
