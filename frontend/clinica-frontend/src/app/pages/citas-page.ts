import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { CitaService } from '../services/cita.service';
import { Cita } from '../models/cita.model';

@Component({
  selector: 'app-citas-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterLink
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span>Gestión de citas</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/dashboard">Volver</button>
    </mat-toolbar>

    <div class="page">
      <mat-card class="form-card">
        <mat-card-title>{{ editingId ? 'Editar cita' : 'Nueva cita' }}</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Paciente</mat-label>
              <input matInput formControlName="paciente" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha</mat-label>
              <input matInput formControlName="fecha" type="date" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Hora</mat-label>
              <input matInput formControlName="hora" type="time" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Motivo</mat-label>
              <input matInput formControlName="motivo" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="estado">
                <mat-option [value]=1>Pendiente</mat-option>
                <mat-option [value]=2>Realizada</mat-option>
                <mat-option [value]=3>Cancelada</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
              <button mat-stroked-button type="button" (click)="resetForm()">Limpiar</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-title>Listado de citas</mat-card-title>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Buscar</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Buscar por paciente o motivo" />
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" class="full-width">
            <ng-container matColumnDef="paciente">
              <th mat-header-cell *matHeaderCellDef>Paciente</th>
              <td mat-cell *matCellDef="let cita">{{ cita.paciente }}</td>
            </ng-container>
            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let cita">{{ formatDate(cita.fecha) }}</td>
            </ng-container>
            <ng-container matColumnDef="hora">
              <th mat-header-cell *matHeaderCellDef>Hora</th>
              <td mat-cell *matCellDef="let cita">{{ formatTime(cita.hora) }}</td>
            </ng-container>
            <ng-container matColumnDef="motivo">
              <th mat-header-cell *matHeaderCellDef>Motivo</th>
              <td mat-cell *matCellDef="let cita">{{ cita.motivo }}</td>
            </ng-container>
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let cita">{{ getEstadoLabel(cita.estado) }}</td>
            </ng-container>
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let cita">
                <button mat-icon-button color="primary" (click)="edit(cita)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="confirmDelete(cita)"><mat-icon>delete</mat-icon></button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator [pageSize]=5 [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `.toolbar { position:sticky; top:0; z-index:2; }`,
    `.spacer { flex:1; }`,
    `.page { display:grid; gap:24px; padding:24px; }`,
    `.form-card, .table-card { width:100%; }`,
    `.full-width { width:100%; }`,
    `.actions { display:flex; gap:12px; }`
  ]
})
export class CitasPageComponent implements OnInit {
  displayedColumns = ['paciente', 'fecha', 'hora', 'motivo', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Cita>([]);
  form: FormGroup;
  editingId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      paciente: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required],
      estado: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCitas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadCitas(): void {
    this.citaService.getCitas().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const cita: Cita = this.form.value;

    if (this.editingId) {
      this.citaService.updateCita(this.editingId, cita).subscribe({
        next: () => {
          this.snackBar.open('Cita actualizada correctamente', 'Cerrar', { duration: 2000 });
          this.loadCitas();
          this.resetForm();
        }
      });
    } else {
      this.citaService.createCita(cita).subscribe({
        next: () => {
          this.snackBar.open('Cita creada correctamente', 'Cerrar', { duration: 2000 });
          this.loadCitas();
          this.resetForm();
        }
      });
    }
  }

  edit(cita: Cita): void {
    this.editingId = cita.id ?? null;
    this.form.patchValue(cita);
  }

  confirmDelete(cita: Cita): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { mensaje: `¿Desea eliminar la cita de ${cita.paciente}?` }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.citaService.deleteCita(cita.id!).subscribe({
          next: () => {
            this.snackBar.open('Cita eliminada correctamente', 'Cerrar', { duration: 2000 });
            this.loadCitas();
          }
        });
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ estado: 1 });
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return value;
    }
  }

  formatTime(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    try {
      const [hours, minutes] = value.split(':');
      const hour = Number(hours);
      const minute = Number(minutes);

      if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return value;
      }

      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    } catch {
      return value;
    }
  }

  getEstadoLabel(estado: number): string {
    switch (estado) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Realizada';
      case 3:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  }
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>{{ data.mensaje }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Eliminar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { mensaje: string }) {}
}
