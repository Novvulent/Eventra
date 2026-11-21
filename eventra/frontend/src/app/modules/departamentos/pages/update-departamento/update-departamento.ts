
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { FormDepartamento } from '../../components/form-departamento/form-departamento';
import { Departamento, UpdateDepartamentoRequest } from '../../interfaces/departamento';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-update-departamento',
  standalone: true,
  imports: [Back, PageHeader, FormDepartamento],
  templateUrl: './update-departamento.html'
})
export class UpdateDepartamento implements OnInit {

  id!: number;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private departamentoService = inject(DepartamentoService);

  base = '/admin/departamentos';
  section = 'Localización';
  departamento = signal<Departamento | null>(null);
  saving = signal(false);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = Number(paramId);
    if (!paramId || !Number.isFinite(this.id) || this.id <= 0) {
      this.alertService.toast('Identificador no válido', 'error');
      this.goToList();
      return;
    }
    this.getDepartamento();
  }

  getDepartamento(): void {
    this.departamentoService.getById(this.id).subscribe({
      next: (data) => this.departamento.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el departamento'), 'error');
        this.goToList();
      }
    });
  }

  updateDepartamento(data: UpdateDepartamentoRequest): void {
    this.saving.set(true);
    this.departamentoService.update(this.id, data).subscribe({
      next: () => {
        this.alertService.toast('Departamento actualizado correctamente', 'success');
        this.goToList();
      },
      error: (e) => {
        this.saving.set(false);
        this.alertService.toast(errorMessage(e, 'Error al actualizar el departamento'), 'error');
      }
    });
  }

  goToList(): void {
    this.router.navigateByUrl(this.base);
  }

}
