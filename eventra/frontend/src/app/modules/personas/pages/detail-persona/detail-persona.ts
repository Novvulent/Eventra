
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Back } from '../../../shared/components/back/back';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { Persona } from '../../interfaces/persona';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-detail-persona',
  standalone: true,
  imports: [Back, Button, PageHeader],
  templateUrl: './detail-persona.html'
})
export class DetailPersona implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private personaService = inject(PersonaService);
  private alertService = inject(AlertService);

  base = '/admin/personas';
  section = 'Usuarios';

  persona = signal<Persona | null>(null);

  editButtonConfig: ButtonConfig = {
    id: 'edit-persona-button',
    title: 'Editar',
    type: 'primary',
    icon: 'pencil'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getPersona(id);
  }

  getPersona(id: number): void {
    this.personaService.getById(id).subscribe({
      next: (data) => this.persona.set(data),
      error: (e) => {
        this.alertService.toast(errorMessage(e, 'Error al consultar la persona'), 'error');
        this.router.navigateByUrl(this.base);
      }
    });
  }

  edit(): void {
    const item = this.persona();
    if (item) this.router.navigateByUrl(`${this.base}/update/${item.id_persona}`);
  }

}
