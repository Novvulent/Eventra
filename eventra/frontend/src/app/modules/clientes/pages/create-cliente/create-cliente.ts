
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormCliente } from '../../components/form-cliente/form-cliente';
import { CreateClienteRequest } from '../../interfaces/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-create-cliente',
  standalone: true,
  imports: [Back, PageHeader, FormCliente],
  templateUrl: './create-cliente.html'
})
export class CreateCliente {

  private router = inject(Router);
  private alertService = inject(AlertService);
  private clienteService = inject(ClienteService);

  base = '/admin/clientes';
  section = 'Usuarios';

  saving = signal(false);

  createCliente(request: CreateClienteRequest): void {
    let data = request;
    this.saving.set(true);
    this.clienteService.create(data).subscribe({
      next: () => {
        this.alertService.toast('Cliente registrado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al registrar el cliente'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
