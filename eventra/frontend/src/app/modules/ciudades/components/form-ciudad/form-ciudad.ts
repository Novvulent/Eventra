
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Departamento } from '../../../departamentos/interfaces/departamento';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { cleanPayload, toNumber } from '../../../shared/utils/form';
import { Ciudad, CreateCiudadRequest } from '../../interfaces/ciudad';

/**
 * Formulario de ciudad (reactivo). Se reutiliza en las páginas de registro y actualización:
 * si recibe "value" funciona en modo edición.
 */
@Component({
  selector: 'app-form-ciudad',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-ciudad.html'
})
export class FormCiudad implements OnInit, OnChanges {

  /** Registro a editar (null = registro nuevo). */
  @Input() value: Ciudad | null = null;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<CreateCiudadRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private departamentoService = inject(DepartamentoService);

  departamentos: Departamento[] = [];

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    id_departamento: [null as number | null, [Validators.required]],
  });

  get editing(): boolean {
    return this.value !== null;
  }

  ngOnInit(): void {
    this.departamentoService.getAll().subscribe({
      next: (list) => (this.departamentos = list),
      error: () => this.alertService.toast('No se pudo cargar la lista de departamentos', 'error')
    });
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

  setValues(v: Ciudad): void {
    this.form.patchValue({
      nombre: v.nombre ?? '',
      id_departamento: v.id_departamento ?? null,
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
    const data: CreateCiudadRequest = cleanPayload({
      nombre: v.nombre,
      id_departamento: toNumber(v.id_departamento),
    }, { editing: this.editing, required: ['nombre', 'id_departamento'] });
    this.save.emit(data);
  }

}
