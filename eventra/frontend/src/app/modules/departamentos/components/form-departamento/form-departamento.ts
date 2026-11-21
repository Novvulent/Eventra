
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Pais } from '../../../paises/interfaces/pais';
import { PaisService } from '../../../paises/services/pais.service';
import { cleanPayload, toNumber } from '../../../shared/utils/form';
import { Departamento, CreateDepartamentoRequest } from '../../interfaces/departamento';

/**
 * Formulario de departamento (reactivo). Se reutiliza en las páginas de registro y actualización:
 * si recibe "value" funciona en modo edición.
 */
@Component({
  selector: 'app-form-departamento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-departamento.html'
})
export class FormDepartamento implements OnInit, OnChanges {

  /** Registro a editar (null = registro nuevo). */
  @Input() value: Departamento | null = null;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<CreateDepartamentoRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private paisService = inject(PaisService);

  paises: Pais[] = [];

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    id_pais: [null as number | null, [Validators.required]],
  });

  get editing(): boolean {
    return this.value !== null;
  }

  ngOnInit(): void {
    this.paisService.getAll().subscribe({
      next: (list) => (this.paises = list),
      error: () => this.alertService.toast('No se pudo cargar la lista de paises', 'error')
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

  setValues(v: Departamento): void {
    this.form.patchValue({
      nombre: v.nombre ?? '',
      id_pais: v.id_pais ?? null,
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
    const data: CreateDepartamentoRequest = cleanPayload({
      nombre: v.nombre,
      id_pais: toNumber(v.id_pais),
    }, { editing: this.editing, required: ['nombre', 'id_pais'] });
    this.save.emit(data);
  }

}
