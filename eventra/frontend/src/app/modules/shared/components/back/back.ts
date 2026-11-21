import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonConfig } from '../../interfaces/button';
import { Button } from '../button/button';

/** Botón para volver a la pantalla anterior. */
@Component({
  selector: 'app-back',
  standalone: true,
  imports: [Button],
  template: `<app-button [config]="configBackButton" (onClick)="goBack()" />`
})
export class Back {
  private location = inject(Location);

  configBackButton: ButtonConfig = {
    id: 'back-button',
    title: 'Volver',
    type: 'light',
    icon: 'arrow-left'
  };

  goBack(): void {
    this.location.back();
  }
}
