
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { cleanPayload } from '../../../shared/utils/form';
import { Pais, CreatePaisRequest } from '../../interfaces/pais';

/**
 * Formulario de país (reactivo). Se reutiliza en las páginas de registro y actualización:
 * si recibe "value" funciona en modo edición.
 */
@Component({
  selector: 'app-form-pais',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-pais.html'
})
export class FormPais implements OnInit, OnChanges {

  /** Registro a editar (null = registro nuevo). */
  @Input() value: Pais | null = null;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<CreatePaisRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);



  form = this.fb.group({
    nombre: ['', [Validators.required]],
  });

  get editing(): boolean {
    return this.value !== null;
  }

  ngOnInit(): void {

    this.applyMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo se cargan los valores cuando llega un registro nuevo (no al cambiar "saving")
    if (changes['value'] && this.value) this.setValues(this.value);
    this.applyMode();
  }

  private applyMode(): void {
    // Sin reglas especiales por modo
  }

  setValues(v: Pais): void {
    this.form.patchValue({
      nombre: v.nombre ?? '',
    });
  }

  invalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.touched && control.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const data: CreatePaisRequest = cleanPayload({
      nombre: v.nombre,
    }, { editing: this.editing, required: ['nombre'] });
    this.save.emit(data);
  }

}
