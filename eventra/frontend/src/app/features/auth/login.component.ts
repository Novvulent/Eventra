import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="ev-auth">
      <section class="ev-auth-art">
        <a class="ev-brand" routerLink="/login">
          <span class="ev-brand-mark"><i class="bi bi-ticket-perforated-fill"></i></span>
          <span class="ev-brand-name">Eventra</span>
        </a>
        <div>
          <p class="ev-auth-quote">Que se abra el <em>telón</em>. Tu próxima función empieza aquí.</p>
          <div class="ev-auth-feats">
            <span><i class="bi bi-stars"></i> Cartelera en vivo</span>
            <span><i class="bi bi-ticket-detailed"></i> Reservas al instante</span>
            <span><i class="bi bi-graph-up-arrow"></i> Reportes para tu equipo</span>
          </div>
        </div>
        <div class="ev-auth-foot">Unidad Central del Valle del Cauca · Proyecto Integrador Web 1</div>
      </section>

      <section class="ev-auth-panel">
        <div class="ev-auth-form">
          <div class="ev-eyebrow"><i class="bi bi-door-open"></i> Bienvenido de nuevo</div>
          <h2>Iniciar sesión</h2>
          <p class="text-muted mb-4">Ingresa con tu correo para continuar.</p>

          @if (error()) {
            <div class="ev-alert danger"><i class="bi bi-exclamation-circle"></i><span>{{ error() }}</span></div>
          }

          <form (ngSubmit)="entrar()" #f="ngForm">
            <div class="mb-3">
              <label class="form-label" for="correo">Correo electrónico</label>
              <div class="ev-input-icon">
                <i class="bi bi-envelope"></i>
                <input class="form-control" id="correo" name="correo" type="email" placeholder="tucorreo@ejemplo.com"
                       autocomplete="email" [(ngModel)]="correo" required>
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label" for="password">Contraseña</label>
              <div class="ev-input-icon">
                <i class="bi bi-lock"></i>
                <input class="form-control pe-5" id="password" name="password" [type]="ver() ? 'text' : 'password'"
                       placeholder="••••••••" autocomplete="current-password" [(ngModel)]="password" required>
                <button type="button" class="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                        (click)="ver.set(!ver())" [attr.aria-label]="ver() ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <i [class]="ver() ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-primary btn-lg w-100" type="submit" [disabled]="f.invalid || loading()">
              @if (loading()) { <span class="spinner-border spinner-border-sm"></span> Ingresando... }
              @else { Ingresar <i class="bi bi-arrow-right"></i> }
            </button>
          </form>
          <p class="text-center text-muted mt-4 mb-0">¿No tienes cuenta? <a class="fw-semibold" routerLink="/registro">Regístrate gratis</a></p>
        </div>
      </section>
    </div>
  `
})
export class LoginComponent {
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
