
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormAdministrador } from '../../components/form-administrador/form-administrador';
import { CreateAdministradorRequest } from '../../interfaces/administrador';
import { AdministradorService } from '../../services/administrador.service';

@Component({
  selector: 'app-create-administrador',
  standalone: true,
  imports: [Back, PageHeader, FormAdministrador],
  templateUrl: './create-administrador.html'
})
export class CreateAdministrador {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private administradorService = inject(AdministradorService);

  base = '/admin/administradores';
  section = 'Usuarios';

  saving = signal(false);

  createAdministrador(request: CreateAdministradorRequest): void {
    let data = request;
    this.saving.set(true);
    this.administradorService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Administrador registrado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar el administrador'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
