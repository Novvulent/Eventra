
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { Departamento } from '../../interfaces/departamento';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-detail-departamento',
  standalone: true,
  imports: [Back, Button, PageHeader],
  templateUrl: './detail-departamento.html'
})
export class DetailDepartamento implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private departamentoService = inject(DepartamentoService);
  private alertService = inject(AlertService);

  base = '/admin/departamentos';
  section = 'Localización';

  departamento = signal<Departamento | null>(null);

  editButtonConfig: ButtonConfig = {
    id: 'edit-departamento-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getDepartamento(id);
  }

  getDepartamento(id: number): void {
    this.departamentoService.getById(id).subscribe({
      next: (data) => this.departamento.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el departamento'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.departamento();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_departamento}`);
  }

}
