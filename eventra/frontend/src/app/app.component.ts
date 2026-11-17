import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { NavbarComponent } from './shared/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="ev-shell" [class.has-sidebar]="!!auth.usuario()">
      @if (auth.usuario()) { <app-navbar /> }
      <div class="ev-content">
        <router-outlet />
      </div>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService);
}
