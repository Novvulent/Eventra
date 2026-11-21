
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormAdministrador } from '../../components/form-administrador/form-administrador';
import { Administrador, UpdateAdministradorRequest } from '../../interfaces/administrador';
import { AdministradorService } from '../../services/administrador.service';

@Component({
  selector: 'app-update-administrador',
  standalone: true,
  imports: [Back, PageHeader, FormAdministrador],
  templateUrl: './update-administrador.html'
})
export class UpdateAdministrador implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private administradorService = inject(AdministradorService);

  base = '/admin/administradores';
  section = 'Usuarios';
  administrador = signal<Administrador | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getAdministrador();
  }

  getAdministrador(): void {
    this.administradorService.getById(this.id).subscribe({
      next: (data) => this.administrador.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el administrador'), 'error');
        this.goToList();
      }
    });
  }

  updateAdministrador(data: UpdateAdministradorRequest): void {
    this.saving.set(true);
    this.administradorService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Administrador actualizado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar el administrador'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
