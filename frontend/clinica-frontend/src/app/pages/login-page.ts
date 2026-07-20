import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <mat-card-title>Ingreso al sistema</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="login()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="usuario" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password" />
            </mat-form-field>

            <button mat-flat-button color="primary" class="full-width" type="submit" [disabled]="form.invalid">
              Ingresar
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `.login-wrapper { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f7fb; }`,
    `.login-card { width:100%; max-width:420px; padding:8px; }`,
    `.full-width { width:100%; }`
  ]
})
export class LoginPageComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.form.invalid) {
      return;
    }

    const { usuario, password } = this.form.value;
    this.authService.login(usuario, password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.snackBar.open('Bienvenido', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.snackBar.open('Credenciales inválidas', 'Cerrar', { duration: 2500 });
      }
    });
  }
}
