import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { CheckHealthUseCase } from '../../application/health/check-health.usecase';

@Component({
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="card">
      <h2>Health</h2>
      <div class="small">GET /payroll/health</div>

      <div class="actions">
        <button type="button" (click)="check()">Probar</button>
      </div>

      <div *ngIf="status() as s" style="margin-top:10px;">
        <span class="pill" [class.ok]="s === 'ok'" [class.bad]="s !== 'ok'">
          status: {{ s }}
        </span>
      </div>

      <div class="err" *ngIf="error()">{{ error() }}</div>
    </div>
  `
})
export class HealthPage {
  status = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(private readonly uc: CheckHealthUseCase) {}

  check() {
    this.error.set(null);
    this.status.set(null);

    this.uc.execute().subscribe({
      next: (r) => this.status.set(r.status ?? 'unknown'),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }
}
