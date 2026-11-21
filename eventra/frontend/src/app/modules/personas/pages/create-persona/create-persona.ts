
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormPersona } from '../../components/form-persona/form-persona';
import { CreatePersonaRequest } from '../../interfaces/persona';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-create-persona',
  standalone: true,
  imports: [Back, PageHeader, FormPersona],
  templateUrl: './create-persona.html'
})
export class CreatePersona {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private personaService = inject(PersonaService);

  base = '/admin/personas';
  section = 'Usuarios';

  saving = signal(false);

  createPersona(request: CreatePersonaRequest): void {
    let data = request;
    this.saving.set(true);
    this.personaService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Persona registrada correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar la persona'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
