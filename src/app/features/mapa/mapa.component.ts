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
  lotes: Lote[] = [];

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
    const group = L.featureGroup();

    lotes.forEach((lote) => {
        if (!lote.geometria) {
            return;
        }

        const layer = L.geoJSON(lote.geometria, {
            style: {
                color: '#3388ff',
                weight: 2,
                opacity: 0.7,
                fillOpacity: 0.3
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`
                    <strong>${lote.referenciaCatastral}</strong><br>
                    Propietario: ${lote.propietarioNombre || 'Desconocido'}<br>
                    Área: ${lote.superficie || 0} m²<br>
                    Estado: ${lote.estado || 'ACTIVO'}
                `);
            }
        });

        layer.addTo(group);
    });

    group.addTo(this.map!);

    if (group.getLayers().length > 0) {
        this.map!.fitBounds(group.getBounds(), {
            padding: [30, 30]
        });
    }
}


}
