import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PropietarioService } from '../../core/services/propietario.service';
import { LoteService } from '../../core/services/lote.service';
import { Propietario } from '../../core/models/propietario.model';
import { Lote } from '../../core/models/lote.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  propietarios: Propietario[] = [];
  lotes: Lote[] = [];
  loading = true;

  constructor(
    private readonly propietarioService: PropietarioService,
    private readonly loteService: LoteService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    forkJoin({
      propietarios: this.propietarioService.listar(),
      lotes: this.loteService.listar()
    }).subscribe({
      next: (response) => {
        this.propietarios = response.propietarios;
        this.lotes = response.lotes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get superficieTotal(): number {
    return this.lotes.reduce((total, lote) => total + lote.superficie, 0);
  }
}
