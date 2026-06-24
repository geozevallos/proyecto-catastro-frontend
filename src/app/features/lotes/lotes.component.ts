import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoteService } from '../../core/services/lote.service';
import { Lote } from '../../core/models/lote.model';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lotes.component.html',
  styleUrl: './lotes.component.scss'
})
export class LotesComponent implements OnInit {
  lotes: Lote[] = [];
  loading = true;

  constructor(private readonly loteService: LoteService) {}

  ngOnInit(): void {
    this.cargarLotes();
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
}
