
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Ciudad } from '../../../ciudades/interfaces/ciudad';
import { CiudadService } from '../../../ciudades/services/ciudad.service';
import { Agente } from '../../../agentes/interfaces/agente';
import { AgenteService } from '../../../agentes/services/agente.service';
import { cleanPayload, toIso, toLocalInput, toNumber } from '../../../shared/utils/form';
import { Evento, CreateEventoRequest } from '../../interfaces/evento';

/**
 * Formulario de evento (reactivo). Se reutiliza en las páginas de registro y actualización:
 * si recibe "value" funciona en modo edición.
 */
@Component({
  selector: 'app-form-evento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-evento.html'
})
export class FormEvento implements OnInit, OnChanges {

  /** Registro a editar (null = registro nuevo). */
  @Input() value: Evento | null = null;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  /** Muestra el selector de agente (solo administradores). */
  @Input() showAgente = true;
  @Output() save = new EventEmitter<CreateEventoRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private ciudadService = inject(CiudadService);
  private agenteService = inject(AgenteService);

  ciudades: Ciudad[] = [];
  agentes: Agente[] = [];
  opcionesEstado = ['Programado', 'En Boletería', 'En Vivo', 'Finalizado', 'Cancelado'];

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    teatro: ['', [Validators.required]],
    id_ciudad: [null as number | null, [Validators.required]],
    fecha_inicio: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    capacidad: [null as number | null, [Validators.required]],
    precio_base: [null as number | null, [Validators.required]],
    estado: [null as string | null, [Validators.required]],
    id_agente: [null as number | null, [Validators.required]],
    descripcion: [''],
    observaciones: [''],
    causa_cancelacion: [''],
  });

  get editing(): boolean {
    return this.value !== null;
  }

  ngOnInit(): void {
    this.ciudadService.getAll().subscribe({
      next: (list) => (this.ciudades = list),
      error: () => this.alertService.toast('No se pudo cargar la lista de ciudades', 'error')
    });
    if (this.showAgente) {
      this.agenteService.getAll().subscribe({
        next: (list) => (this.agentes = list),
        error: () => this.alertService.toast('No se pudo cargar la lista de agentes', 'error')
      });
    }
    this.applyMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo se cargan los valores cuando llega un registro nuevo (no al cambiar "saving")
    if (changes['value'] && this.value) this.setValues(this.value);
    this.applyMode();
  }

  private applyMode(): void {
    // El agente que registra un evento queda como responsable: no elige agente
    const agente = this.form.controls.id_agente;
    agente.setValidators(this.showAgente ? [Validators.required] : []);
    agente.updateValueAndValidity({ emitEvent: false });
  }

  setValues(v: Evento): void {
    this.form.patchValue({
      nombre: v.nombre ?? '',
      teatro: v.teatro ?? '',
      id_ciudad: v.id_ciudad ?? null,
      fecha_inicio: toLocalInput(v.fecha_inicio),
      fecha_fin: toLocalInput(v.fecha_fin),
      capacidad: v.capacidad === null || v.capacidad === undefined ? null : Number(v.capacidad),
      precio_base: v.precio_base === null || v.precio_base === undefined ? null : Number(v.precio_base),
      estado: v.estado ?? null,
      id_agente: v.id_agente ?? null,
      descripcion: v.descripcion ?? '',
      observaciones: v.observaciones ?? '',
      causa_cancelacion: v.causa_cancelacion ?? '',
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
    const data: CreateEventoRequest = cleanPayload({
      nombre: v.nombre,
      teatro: v.teatro,
      id_ciudad: toNumber(v.id_ciudad),
      fecha_inicio: toIso(v.fecha_inicio),
      fecha_fin: toIso(v.fecha_fin),
      capacidad: toNumber(v.capacidad),
      precio_base: toNumber(v.precio_base),
      estado: v.estado,
      id_agente: toNumber(v.id_agente),
      descripcion: v.descripcion,
      observaciones: v.observaciones,
      causa_cancelacion: v.causa_cancelacion,
    }, { editing: this.editing, required: ['nombre', 'teatro', 'id_ciudad', 'fecha_inicio', 'fecha_fin', 'capacidad', 'precio_base', 'estado', 'id_agente'] });
    if (!this.showAgente) delete data.id_agente;
    this.save.emit(data);
  }

}
