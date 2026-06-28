import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { LoteService } from '../../core/services/lote.service';
import { PropietarioService } from '../../core/services/propietario.service';
import { Lote } from '../../core/models/lote.model';
import { Propietario } from '../../core/models/propietario.model';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lotes.component.html',
  styleUrl: './lotes.component.scss'
})
export class LotesComponent implements OnInit, AfterViewChecked, OnDestroy {
  lotes: Lote[] = [];
  loading = true;
  showForm = false;
  isEditing = false;
  editingId: number | null = null;
  @ViewChild('geojsonMap') geojsonMapRef?: ElementRef<HTMLDivElement>;

  loteForm: FormGroup;
  geojsonFileName = '';
  propietarios: Propietario[] = [];
  private map?: L.Map;
  private previewLayer?: L.Layer;
  private mapInitialized = false;

  constructor(
    private readonly loteService: LoteService,
    private readonly propietarioService: PropietarioService,
    private readonly fb: FormBuilder
  ) {
    this.loteForm = this.fb.group({
      referenciaCatastral: ['', Validators.required],
      direccion: ['', Validators.required],
      superficie: [0, [Validators.required, Validators.min(0)]],
      tipo: ['URBANO', Validators.required],
      propietarioId: [1, Validators.required],
      geometria: ['{"type":"Polygon","coordinates":[[[-70.55,-33.55],[-70.45,-33.55],[-70.45,-33.45],[-70.55,-33.45],[-70.55,-33.55]]]}', Validators.required],
      estado: ['ACTIVO', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarLotes();
    this.cargarPropietarios();
  }

  ngAfterViewChecked(): void {
    if (this.showForm && !this.mapInitialized && this.geojsonMapRef?.nativeElement) {
      this.crearPreviewMapa();
      this.mapInitialized = true;
      this.renderizarGeometria(this.loteForm.get('geometria')?.value);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private crearPreviewMapa(): void {
    if (!this.geojsonMapRef?.nativeElement) {
      return;
    }

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map(this.geojsonMapRef.nativeElement).setView([-12.05, -77.05], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(this.map);
  }

  cargarLotes(): void {
    this.loading = true;

    this.loteService.listar().subscribe({
      next: (data) => {
        this.lotes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cargarPropietarios(): void {
    this.propietarioService.listar().subscribe({
      next: (data) => {
        this.propietarios = data;
      }
    });
  }

  abrirCrear(): void {
    this.showForm = true;
    this.isEditing = false;
    this.editingId = null;
    this.geojsonFileName = '';
    this.loteForm.reset({
      referenciaCatastral: '',
      direccion: '',
      superficie: 0,
      tipo: 'URBANO',
      propietarioId: 1,
      geometria: '',
      estado: 'ACTIVO'
    });
  }

  abrirEditar(lote: Lote): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingId = lote.id ?? null;
    this.geojsonFileName = 'Geometría actual';
    this.loteForm.reset({
      referenciaCatastral: lote.referenciaCatastral,
      direccion: lote.direccion,
      superficie: lote.superficie,
      tipo: lote.tipo,
      propietarioId: lote.propietarioId,
      geometria: typeof lote.geometria === 'string' ? lote.geometria : JSON.stringify(lote.geometria),
      estado: lote.estado
    });
  }

  guardar(): void {
    if (this.loteForm.invalid) {
      this.loteForm.markAllAsTouched();
      return;
    }

    const payload = this.loteForm.getRawValue();

    if (this.isEditing && this.editingId !== null) {
      this.loteService.actualizar(this.editingId, payload).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El lote se actualizó correctamente.', 'success');
          this.cancelar();
          this.cargarLotes();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el lote.', 'error');
        }
      });
      return;
    }

    this.loteService.crear(payload).subscribe({
      next: () => {
        Swal.fire('Creado', 'El lote se creó correctamente.', 'success');
        this.cancelar();
        this.cargarLotes();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el lote.', 'error');
      }
    });
  }

  eliminar(lote: Lote): void {
    Swal.fire({
      title: '¿Eliminar lote?',
      text: `Se eliminará el lote ${lote.referenciaCatastral}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.loteService.eliminar(lote.id ?? 0).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'El lote fue eliminado.', 'success');
          this.cargarLotes();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo eliminar el lote.', 'error');
        }
      });
    });
  }

  descargarReporte(lote: Lote): void {
    if (!lote.id) {
      Swal.fire('Error', 'No se puede generar el reporte sin identificar el lote.', 'error');
      return;
    }

    Swal.fire({
      title: 'Generando reporte',
      text: 'Se está solicitando el archivo PDF del lote.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    console.log('GAAAAAAAAAAAAAAAAAAAAAAA');

    this.loteService.solicitarReporte(lote.id).subscribe({
      next: (response) => {
        console.log('asdadsadsad');
        const ruta = response.ruta || response.path || response.filePath || response.archivo;

        if (!ruta) {
          Swal.fire('Error', 'La respuesta del servicio no incluyó la ruta del archivo.', 'error');
          return;
        }

        console.log(ruta)

        this.loteService.descargarReporte(ruta).subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte_lote_${lote.id}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
            Swal.fire('Reporte listo', 'El archivo se descargó correctamente.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo descargar el reporte.', 'error');
          }
        });
      },
      error: (err) => {
        console.error('Error al solicitar el reporte:', err);
        Swal.fire('Error', 'No se pudo solicitar el reporte.', 'error');
      }
    });
  }

  onGeojsonSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.geojsonFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        this.loteForm.patchValue({ geometria: JSON.stringify(parsed) });
        this.renderizarGeometria(JSON.stringify(parsed));
        Swal.fire('GeoJSON cargado', 'El archivo se cargó correctamente.', 'success');
      } catch {
        Swal.fire('Error', 'El archivo seleccionado no es un GeoJSON válido.', 'error');
      }
    };

    reader.readAsText(file);
  }
  private renderizarGeometria(geojson: string | null | undefined): void {
    this.limpiarPreview();

    if (!geojson || !this.map) {
      return;
    }

    try {
      const parsed = JSON.parse(geojson) as GeoJSON.GeoJsonObject;
      this.previewLayer = L.geoJSON(parsed, {
        style: {
          color: '#2563eb',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.25
        }
      });
      this.previewLayer.addTo(this.map);

      const bounds = (this.previewLayer as L.GeoJSON).getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch {
      this.limpiarPreview();
    }
  }

  private limpiarPreview(): void {
    if (this.previewLayer) {
      this.previewLayer.remove();
      this.previewLayer = undefined;
    }
  }
  cancelar(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingId = null;
    this.geojsonFileName = '';
    this.mapInitialized = false;
    this.limpiarPreview();
    this.loteForm.reset({
      referenciaCatastral: '',
      direccion: '',
      superficie: 0,
      tipo: 'URBANO',
      propietarioId: 1,
      geometria: '',
      estado: 'ACTIVO'
    });
  }
}
