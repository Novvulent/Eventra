import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonConfig } from '../../interfaces/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html'
})
export class Button {
  @Input({ required: true }) config!: ButtonConfig;
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<string>();

  click(): void {
    this.onClick.emit(this.config.id);
  }
}
