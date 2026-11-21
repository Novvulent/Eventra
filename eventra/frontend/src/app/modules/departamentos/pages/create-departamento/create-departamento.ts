
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormDepartamento } from '../../components/form-departamento/form-departamento';
import { CreateDepartamentoRequest } from '../../interfaces/departamento';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-create-departamento',
  standalone: true,
  imports: [Back, PageHeader, FormDepartamento],
  templateUrl: './create-departamento.html'
})
export class CreateDepartamento {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private departamentoService = inject(DepartamentoService);

  base = '/admin/departamentos';
  section = 'Localización';

  saving = signal(false);

  createDepartamento(request: CreateDepartamentoRequest): void {
    let data = request;
    this.saving.set(true);
    this.departamentoService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Departamento registrado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar el departamento'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
