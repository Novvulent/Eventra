
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormCliente } from '../../components/form-cliente/form-cliente';
import { Cliente, UpdateClienteRequest } from '../../interfaces/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-update-cliente',
  standalone: true,
  imports: [Back, PageHeader, FormCliente],
  templateUrl: './update-cliente.html'
})
export class UpdateCliente implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private clienteService = inject(ClienteService);

  base = '/admin/clientes';
  section = 'Usuarios';
  cliente = signal<Cliente | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getCliente();
  }

  getCliente(): void {
    this.clienteService.getById(this.id).subscribe({
      next: (data) => this.cliente.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el cliente'), 'error');
        this.goToList();
      }
    });
  }

  updateCliente(data: UpdateClienteRequest): void {
    this.saving.set(true);
    this.clienteService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Cliente actualizado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar el cliente'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
