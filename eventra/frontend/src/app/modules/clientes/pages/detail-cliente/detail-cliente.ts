
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { Cliente } from '../../interfaces/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-detail-cliente',
  standalone: true,
  imports: [Back, Button, PageHeader],
  templateUrl: './detail-cliente.html'
})
export class DetailCliente implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private alertService = inject(AlertService);

  base = '/admin/clientes';
  section = 'Usuarios';

  cliente = signal<Cliente | null>(null);

  editButtonConfig: ButtonConfig = {
    id: 'edit-cliente-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getCliente(id);
  }

  getCliente(id: number): void {
    this.clienteService.getById(id).subscribe({
      next: (data) => this.cliente.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el cliente'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.cliente();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_persona}`);
  }

}
