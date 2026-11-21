
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormPais } from '../../components/form-pais/form-pais';
import { Pais, UpdatePaisRequest } from '../../interfaces/pais';
import { PaisService } from '../../services/pais.service';

@Component({
  selector: 'app-update-pais',
  standalone: true,
  imports: [Back, PageHeader, FormPais],
  templateUrl: './update-pais.html'
})
export class UpdatePais implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private paisService = inject(PaisService);

  base = '/admin/paises';
  section = 'Localización';
  pais = signal<Pais | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getPais();
  }

  getPais(): void {
    this.paisService.getById(this.id).subscribe({
      next: (data) => this.pais.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el país'), 'error');
        this.goToList();
      }
    });
  }

  updatePais(data: UpdatePaisRequest): void {
    this.saving.set(true);
    this.paisService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('País actualizado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar el país'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
