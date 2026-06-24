import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  form = this.formBuilder.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required]]
  });

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const request: RegisterRequest = {
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
      fullName: this.form.value.fullName ?? ''
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Registro exitoso', 'La cuenta se ha creado correctamente.', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No fue posible registrar el usuario. Verifica los datos e intenta nuevamente.', 'error');
      }
    });
  }
}
