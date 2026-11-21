
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { Administrador } from '../../interfaces/administrador';
import { AdministradorService } from '../../services/administrador.service';

@Component({
  selector: 'app-detail-administrador',
  standalone: true,
  imports: [Back, Button, PageHeader, CurrencyPipe],
  templateUrl: './detail-administrador.html'
})
export class DetailAdministrador implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private administradorService = inject(AdministradorService);
  private alertService = inject(AlertService);

  base = '/admin/administradores';
  section = 'Usuarios';

  administrador = signal<Administrador | null>(null);

  editButtonConfig: ButtonConfig = {
    id: 'edit-administrador-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getAdministrador(id);
  }

  getAdministrador(id: number): void {
    this.administradorService.getById(id).subscribe({
      next: (data) => this.administrador.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el administrador'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.administrador();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_persona}`);
  }

}
