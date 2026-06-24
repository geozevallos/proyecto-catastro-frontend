import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropietarioService } from '../../core/services/propietario.service';
import { Propietario } from '../../core/models/propietario.model';

@Component({
  selector: 'app-propietarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './propietarios.component.html',
  styleUrl: './propietarios.component.scss'
})
export class PropietariosComponent implements OnInit {
  propietarios: Propietario[] = [];
  loading = true;

  constructor(private readonly propietarioService: PropietarioService) {}

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
}
