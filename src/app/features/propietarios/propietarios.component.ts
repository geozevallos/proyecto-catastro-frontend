import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PropietarioService } from '../../core/services/propietario.service';
import { Propietario } from '../../core/models/propietario.model';

@Component({
  selector: 'app-propietarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './propietarios.component.html',
  styleUrl: './propietarios.component.scss'
})
export class PropietariosComponent implements OnInit {
  propietarios: Propietario[] = [];
  loading = true;
  showForm = false;
  isEditing = false;
  editingId: number | null = null;
  propietarioForm: FormGroup;

  constructor(
    private readonly propietarioService: PropietarioService,
    private readonly fb: FormBuilder
  ) {
    this.propietarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      tipo: ['PERSONA_NATURAL', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarPropietarios();
  }

  cargarPropietarios(): void {
    this.loading = true;

    this.propietarioService.listar().subscribe({
      next: (data) => {
        this.propietarios = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  abrirCrear(): void {
    this.showForm = true;
    this.isEditing = false;
    this.editingId = null;
    this.propietarioForm.reset({
      nombre: '',
      apellido: '',
      documento: '',
      email: '',
      telefono: '+51',
      direccion: '',
      tipo: 'Persona natural'
    });
  }

  abrirEditar(propietario: Propietario): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingId = propietario.id ?? null;
    this.propietarioForm.reset({
      nombre: propietario.nombre,
      apellido: propietario.apellido,
      documento: propietario.documento,
      email: propietario.email,
      telefono: propietario.telefono,
      direccion: propietario.direccion,
      tipo: propietario.tipo
    });
  }

  guardar(): void {
    if (this.propietarioForm.invalid) {
      this.propietarioForm.markAllAsTouched();
      return;
    }

    const payload = this.propietarioForm.getRawValue();

    if (this.isEditing && this.editingId !== null) {
      this.propietarioService.actualizar(this.editingId, payload).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El propietario se actualizó correctamente.', 'success');
          this.cancelar();
          this.cargarPropietarios();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el propietario.', 'error');
        }
      });
      return;
    }

    this.propietarioService.crear(payload).subscribe({
      next: () => {
        Swal.fire('Creado', 'El propietario se creó correctamente.', 'success');
        this.cancelar();
        this.cargarPropietarios();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el propietario.', 'error');
      }
    });
  }

  eliminar(propietario: Propietario): void {
    Swal.fire({
      title: '¿Eliminar propietario?',
      text: `Se eliminará a ${propietario.nombre} ${propietario.apellido}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.propietarioService.eliminar(propietario.id ?? 0).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'El propietario fue eliminado.', 'success');
          this.cargarPropietarios();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo eliminar el propietario.', 'error');
        }
      });
    });
  }

  cancelar(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingId = null;
    this.propietarioForm.reset({
      nombre: '',
      apellido: '',
      documento: '',
      email: '',
      telefono: '',
      direccion: '',
      tipo: 'PERSONA_NATURAL'
    });
  }
}
