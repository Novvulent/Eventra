import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Ciudad } from '../../../ciudades/interfaces/ciudad';
import { CiudadService } from '../../../ciudades/services/ciudad.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private ciudadService = inject(CiudadService);

  ciudades = signal<Ciudad[]>([]);
  error = signal('');
  ok = signal(false);
  m: Record<string, any> = { rol: 'cliente' };

  ngOnInit(): void {
    this.ciudadService.getAll().subscribe({
      next: (c) => this.ciudades.set(c),
      error: () => this.error.set('No se pudieron cargar las ciudades')
    });
  }

  registrar(): void {
    this.error.set('');
    this.auth.register(this.m).subscribe({
      next: () => {
        this.ok.set(true);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudo completar el registro')
    });
  }
}
