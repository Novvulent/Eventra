
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormCiudad } from '../../components/form-ciudad/form-ciudad';
import { Ciudad, UpdateCiudadRequest } from '../../interfaces/ciudad';
import { CiudadService } from '../../services/ciudad.service';

@Component({
  selector: 'app-update-ciudad',
  standalone: true,
  imports: [Back, PageHeader, FormCiudad],
  templateUrl: './update-ciudad.html'
})
export class UpdateCiudad implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private ciudadService = inject(CiudadService);

  base = '/admin/ciudades';
  section = 'Localización';
  ciudad = signal<Ciudad | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getCiudad();
  }

  getCiudad(): void {
    this.ciudadService.getById(this.id).subscribe({
      next: (data) => this.ciudad.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar la ciudad'), 'error');
        this.goToList();
      }
    });
  }

  updateCiudad(data: UpdateCiudadRequest): void {
    this.saving.set(true);
    this.ciudadService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Ciudad actualizada correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar la ciudad'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
