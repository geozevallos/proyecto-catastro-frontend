import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { LoteService } from '../../core/services/lote.service';
import { Lote } from '../../core/models/lote.model';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  private map?: L.Map;
  private layers: { lote: Lote; layer: L.Layer; highlighted?: L.Layer }[] = [];
  lotes: Lote[] = [];
  loteSeleccionadoId: number | null = null;

  constructor(private readonly loteService: LoteService) {}

  ngAfterViewInit(): void {
    this.crearMapa();
    this.cargarLotes();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private crearMapa(): void {
    this.map = L.map('map').setView([-12.05, -77.05], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(this.map);
  }

  private cargarLotes(): void {
    this.loteService.listar().subscribe({
      next: (data) => {
        this.lotes = data;
        this.dibujarLotes(data);
      }
    });
  }

private dibujarLotes(lotes: Lote[]): void {
    this.layers = [];
    const group = L.featureGroup();

    lotes.forEach((lote) => {
        const geometria = this.parsearGeometria(lote.geometria);

        if (!geometria) {
            return;
        }

        const layer = L.geoJSON(geometria, {
            style: {
                color: '#3388ff',
                weight: 2,
                opacity: 0.7,
                fillOpacity: 0.3
            },
            onEachFeature: (_feature, layer) => {
                layer.bindPopup(`
                    <strong>${lote.referenciaCatastral}</strong><br>
                    Propietario: ${lote.propietarioNombre || 'Desconocido'}<br>
                    Área: ${lote.superficie || 0} m²<br>
                    Estado: ${lote.estado || 'ACTIVO'}
                `);
            }
        });

        layer.addTo(group);
        this.layers.push({ lote, layer });
    });

    group.addTo(this.map!);

    if (group.getLayers().length > 0) {
        this.map!.fitBounds(group.getBounds(), {
            padding: [30, 30]
        });
    }
}

centrarEnLote(lote: Lote): void {
    const entry = this.layers.find((item) => item.lote.id === lote.id);

    if (!entry?.layer || !this.map) {
        return;
    }

    this.loteSeleccionadoId = lote.id ?? null;

    this.layers.forEach((item) => {
      if (item.layer instanceof L.GeoJSON) {
        item.layer.setStyle({
          color: '#3388ff',
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.3
        });
      }
    });

    const layer = entry.layer as L.GeoJSON;
    layer.setStyle({
      color: '#dc2626',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.45
    });

    const bounds = layer.getBounds();

    if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [30, 30], maxZoom: 18 });
    }
}

private parsearGeometria(geometria: Lote['geometria']): GeoJSON.GeoJsonObject | null {
    if (!geometria) {
        return null;
    }

    if (typeof geometria === 'string') {
        try {
            return JSON.parse(geometria) as GeoJSON.GeoJsonObject;
        } catch {
            return null;
        }
    }

    return geometria;
}


}
