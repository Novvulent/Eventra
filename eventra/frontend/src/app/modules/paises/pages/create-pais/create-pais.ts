
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormPais } from '../../components/form-pais/form-pais';
import { CreatePaisRequest } from '../../interfaces/pais';
import { PaisService } from '../../services/pais.service';

@Component({
  selector: 'app-create-pais',
  standalone: true,
  imports: [Back, PageHeader, FormPais],
  templateUrl: './create-pais.html'
})
export class CreatePais {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private paisService = inject(PaisService);

  base = '/admin/paises';
  section = 'Localización';

  saving = signal(false);

  createPais(request: CreatePaisRequest): void {
    let data = request;
    this.saving.set(true);
    this.paisService.create(data).subscribe({
      next: () => {
        this.alertService.toast('País registrado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar el país'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
