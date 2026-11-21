
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Ciudad } from '../../../ciudades/interfaces/ciudad';
import { CiudadService } from '../../../ciudades/services/ciudad.service';
import { cleanPayload, joinPhones, splitPhones, toNumber } from '../../../shared/utils/form';
import { Agente, CreateAgenteRequest } from '../../interfaces/agente';

/**
 * Formulario de agente (reactivo). Se reutiliza en las páginas de registro y actualización:
 * si recibe "value" funciona en modo edición.
 */
@Component({
  selector: 'app-form-agente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-agente.html'
})
export class FormAgente implements OnInit, OnChanges {

  /** Registro a editar (null = registro nuevo). */
  @Input() value: Agente | null = null;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<CreateAgenteRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private ciudadService = inject(CiudadService);

  ciudades: Ciudad[] = [];

  form = this.fb.group({
    identificacion: ['', [Validators.required]],
    nombre_completo: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    password: [''],
    direccion: ['', [Validators.required]],
    id_ciudad: [null as number | null, [Validators.required]],
    telefonos: [''],
    comision: [null as number | null],
    experiencia: [null as number | null],
  });

  get editing(): boolean {
    return this.value !== null;
  }

  ngOnInit(): void {
    this.ciudadService.getAll().subscribe({
      next: (list) => (this.ciudades = list),
      error: () => this.alertService.toast('No se pudo cargar la lista de ciudades', 'error')
    });
    this.applyMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo se cargan los valores cuando llega un registro nuevo (no al cambiar "saving")
    if (changes['value'] && this.value) this.setValues(this.value);
    this.applyMode();
  }

  private applyMode(): void {
    // La contraseña es obligatoria solo al crear
    const password = this.form.controls.password;
    password.setValidators(this.editing ? [] : [Validators.required]);
    password.updateValueAndValidity({ emitEvent: false });
  }

  setValues(v: Agente): void {
    this.form.patchValue({
      identificacion: v.identificacion ?? '',
      nombre_completo: v.nombre_completo ?? '',
      correo: v.correo ?? '',
      password: '',
      direccion: v.direccion ?? '',
      id_ciudad: v.id_ciudad ?? null,
      telefonos: joinPhones(v.telefonos),
      comision: v.comision === null || v.comision === undefined ? null : Number(v.comision),
      experiencia: v.experiencia === null || v.experiencia === undefined ? null : Number(v.experiencia),
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
    const data: CreateAgenteRequest = cleanPayload({
      identificacion: v.identificacion,
      nombre_completo: v.nombre_completo,
      correo: v.correo,
      password: v.password,
      direccion: v.direccion,
      id_ciudad: toNumber(v.id_ciudad),
      telefonos: splitPhones(v.telefonos),
      comision: toNumber(v.comision),
      experiencia: toNumber(v.experiencia),
    }, { editing: this.editing, required: ['identificacion', 'nombre_completo', 'correo', 'direccion', 'id_ciudad'], omitIfEmpty: ['password'] });
    this.save.emit(data);
  }

}
