import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CitaService } from '../services/cita.service';
import { AuthService } from '../services/auth.service';
import { Cita } from '../models/cita.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span>Clínica Dental</span>
      <span class="spacer"></span>
      <button mat-button (click)="logout()">Cerrar sesión</button>
    </mat-toolbar>

    <mat-sidenav-container class="container">
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard">Dashboard</a>
          <a mat-list-item routerLink="/citas">Citas</a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <div class="content">
          <div class="cards">
            <mat-card>
              <mat-card-title>Total de citas</mat-card-title>
              <mat-card-content>{{ totalCitas }}</mat-card-content>
            </mat-card>
            <mat-card>
              <mat-card-title>Próximas citas</mat-card-title>
              <mat-card-content>{{ loading ? 'Cargando...' : proximasCitas.length }}</mat-card-content>
            </mat-card>
            <button mat-flat-button color="primary" routerLink="/citas">Nueva cita</button>
          </div>

          <h2>Próximas citas</h2>
          <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
          <table *ngIf="!loading && proximasCitas.length > 0" mat-table [dataSource]="proximasCitas" class="mat-elevation-z1 full-width">
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
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `.toolbar { position:sticky; top:0; z-index:2; }`,
    `.spacer { flex:1; }`,
    `.container { height:calc(100vh - 64px); }`,
    `.content { padding:24px; }`,
    `.cards { display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:24px; }`,
    `.full-width { width:100%; }`,
    `.error { color:#b00020; margin-bottom:16px; }`
  ]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  displayedColumns = ['paciente', 'fecha', 'hora', 'motivo'];
  citas: Cita[] = [];
  proximasCitas: Cita[] = [];
  totalCitas = 0;
  loading = false;
  errorMessage = '';
  private routerSubscription?: Subscription;

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects.startsWith('/dashboard')) {
          this.refreshCitas();
        }
      });

    this.refreshCitas();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  refreshCitas(): void {
    setTimeout(() => this.loadCitas(), 0);
  }

  loadCitas(): void {
    this.loading = true;
    this.errorMessage = '';
    this.citas = [];
    this.proximasCitas = [];
    this.totalCitas = 0;

    this.citaService.getCitas().subscribe({
      next: (data) => {
        this.citas = data || [];
        this.totalCitas = this.citas.length;
        this.proximasCitas = this.citas.slice(0, 5);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.citas = [];
        this.proximasCitas = [];
        this.totalCitas = 0;
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar las citas. Revisa el microservicio de citas.';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
