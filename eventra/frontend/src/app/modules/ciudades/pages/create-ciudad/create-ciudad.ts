
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormCiudad } from '../../components/form-ciudad/form-ciudad';
import { CreateCiudadRequest } from '../../interfaces/ciudad';
import { CiudadService } from '../../services/ciudad.service';

@Component({
  selector: 'app-create-ciudad',
  standalone: true,
  imports: [Back, PageHeader, FormCiudad],
  templateUrl: './create-ciudad.html'
})
export class CreateCiudad {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private ciudadService = inject(CiudadService);

  base = '/admin/ciudades';
  section = 'Localización';

  saving = signal(false);

  createCiudad(request: CreateCiudadRequest): void {
    let data = request;
    this.saving.set(true);
    this.ciudadService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Ciudad registrada correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar la ciudad'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
