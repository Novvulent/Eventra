import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  correo = '';
  password = '';
  error = signal('');
  loading = signal(false);
  ver = signal(false);

  constructor() {
    const u = this.auth.usuario();
    if (u) this.router.navigate([this.auth.homeFor(u.rol)]);
  }

  entrar(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.correo, this.password).subscribe({
      next: (u) => this.router.navigate([this.auth.homeFor(u.rol)]),
      error: (e) => {
        this.error.set(e?.error?.message ?? 'No se pudo iniciar sesión');
        this.loading.set(false);
      }
    });
  }
}
