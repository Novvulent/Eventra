
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Ciudad } from '../../../ciudades/interfaces/ciudad';
import { CiudadService } from '../../../ciudades/services/ciudad.service';
import { cleanPayload, joinPhones, splitPhones, toNumber } from '../../../shared/utils/form';
import { Cliente, CreateClienteRequest } from '../../interfaces/cliente';

/**
 * Formulario de cliente (reactivo). Se reutiliza en las páginas de registro y actualización:
 * si recibe "value" funciona en modo edición.
 */
@Component({
  selector: 'app-form-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-cliente.html'
})
export class FormCliente implements OnInit, OnChanges {

  /** Registro a editar (null = registro nuevo). */
  @Input() value: Cliente | null = null;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<CreateClienteRequest>();
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
    puntos: [null as number | null],
    visualizacion_publicidad: [false],
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

  setValues(v: Cliente): void {
    this.form.patchValue({
      identificacion: v.identificacion ?? '',
      nombre_completo: v.nombre_completo ?? '',
      correo: v.correo ?? '',
      password: '',
      direccion: v.direccion ?? '',
      id_ciudad: v.id_ciudad ?? null,
      telefonos: joinPhones(v.telefonos),
      puntos: v.puntos === null || v.puntos === undefined ? null : Number(v.puntos),
      visualizacion_publicidad: !!v.visualizacion_publicidad,
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
    const data: CreateClienteRequest = cleanPayload({
      identificacion: v.identificacion,
      nombre_completo: v.nombre_completo,
      correo: v.correo,
      password: v.password,
      direccion: v.direccion,
      id_ciudad: toNumber(v.id_ciudad),
      telefonos: splitPhones(v.telefonos),
      puntos: toNumber(v.puntos),
      visualizacion_publicidad: !!v.visualizacion_publicidad,
    }, { editing: this.editing, required: ['identificacion', 'nombre_completo', 'correo', 'direccion', 'id_ciudad'], omitIfEmpty: ['password'] });
    this.save.emit(data);
  }

}
