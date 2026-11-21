
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Cliente } from '../../../clientes/interfaces/cliente';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { Evento } from '../../../eventos/interfaces/evento';
import { EventoService } from '../../../eventos/services/evento.service';
import { cleanPayload, toIso, toLocalInput, toNumber } from '../../../shared/utils/form';
import { Reserva, CreateReservaRequest } from '../../interfaces/reserva';

/**
 * Formulario de reserva (reactivo). Se reutiliza en las páginas de registro y actualización:
 * si recibe "value" funciona en modo edición.
 */
@Component({
  selector: 'app-form-reserva',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-reserva.html'
})
export class FormReserva implements OnInit, OnChanges {

  /** Registro a editar (null = registro nuevo). */
  @Input() value: Reserva | null = null;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<CreateReservaRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private clienteService = inject(ClienteService);
  private eventoService = inject(EventoService);

  clientes: Cliente[] = [];
  eventos: Evento[] = [];
  opcionesEstado = ['Reservada', 'Confirmada', 'Cancelada'];

  form = this.fb.group({
    id_cliente: [null as number | null, [Validators.required]],
    codigo_evento: [null as number | null, [Validators.required]],
    numero_entradas: [null as number | null, [Validators.required]],
    valor_total: [null as number | null],
    fecha_hora: [''],
    estado: [null as string | null],
    causa_cancelacion: [''],
    observaciones: [''],
  });

  get editing(): boolean {
    return this.value !== null;
  }

  ngOnInit(): void {
    this.clienteService.getAll().subscribe({
      next: (list) => (this.clientes = list),
      error: () => this.alertService.toast('No se pudo cargar la lista de clientes', 'error')
    });
    this.eventoService.getAll().subscribe({
      next: (list) => (this.eventos = list),
      error: () => this.alertService.toast('No se pudo cargar la lista de eventos', 'error')
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

  setValues(v: Reserva): void {
    this.form.patchValue({
      id_cliente: v.id_cliente ?? null,
      codigo_evento: v.codigo_evento ?? null,
      numero_entradas: v.numero_entradas === null || v.numero_entradas === undefined ? null : Number(v.numero_entradas),
      valor_total: v.valor_total === null || v.valor_total === undefined ? null : Number(v.valor_total),
      fecha_hora: toLocalInput(v.fecha_hora),
      estado: v.estado ?? null,
      causa_cancelacion: v.causa_cancelacion ?? '',
      observaciones: v.observaciones ?? '',
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
    const data: CreateReservaRequest = cleanPayload({
      id_cliente: toNumber(v.id_cliente),
      codigo_evento: toNumber(v.codigo_evento),
      numero_entradas: toNumber(v.numero_entradas),
      valor_total: toNumber(v.valor_total),
      fecha_hora: toIso(v.fecha_hora),
      estado: v.estado,
      causa_cancelacion: v.causa_cancelacion,
      observaciones: v.observaciones,
    }, { editing: this.editing, required: ['id_cliente', 'codigo_evento', 'numero_entradas'] });
    this.save.emit(data);
  }

}
