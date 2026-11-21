
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { Pais } from '../../interfaces/pais';
import { PaisService } from '../../services/pais.service';

@Component({
  selector: 'app-detail-pais',
  standalone: true,
  imports: [Back, Button, PageHeader],
  templateUrl: './detail-pais.html'
})
export class DetailPais implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private paisService = inject(PaisService);
  private alertService = inject(AlertService);

  base = '/admin/paises';
  section = 'Localización';

  pais = signal<Pais | null>(null);

  editButtonConfig: ButtonConfig = {
    id: 'edit-pais-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getPais(id);
  }

  getPais(id: number): void {
    this.paisService.getById(id).subscribe({
      next: (data) => this.pais.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar el país'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.pais();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_pais}`);
  }

}
