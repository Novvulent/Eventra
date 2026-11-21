
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { Ciudad } from '../../interfaces/ciudad';
import { CiudadService } from '../../services/ciudad.service';

@Component({
  selector: 'app-detail-ciudad',
  standalone: true,
  imports: [Back, Button, PageHeader],
  templateUrl: './detail-ciudad.html'
})
export class DetailCiudad implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ciudadService = inject(CiudadService);
  private alertService = inject(AlertService);

  base = '/admin/ciudades';
  section = 'Localización';

  ciudad = signal<Ciudad | null>(null);

  editButtonConfig: ButtonConfig = {
    id: 'edit-ciudad-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getCiudad(id);
  }

  getCiudad(id: number): void {
    this.ciudadService.getById(id).subscribe({
      next: (data) => this.ciudad.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar la ciudad'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.ciudad();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_ciudad}`);
  }

}
