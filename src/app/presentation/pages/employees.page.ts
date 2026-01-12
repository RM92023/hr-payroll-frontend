import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';

import type { Employee } from '../../domain/employees/employee.model';
import { ListEmployeesUseCase } from '../../application/employees/list-employees.usecase';
import { CreateEmployeeUseCase } from '../../application/employees/create-employee.usecase';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, AsyncPipe, DatePipe],
  template: `
  <div class="row">
    <div class="col card">
      <h2>Crear empleado</h2>
      <form [formGroup]="form" (ngSubmit)="create()">
        <label>Nombre</label>
        <input formControlName="name" placeholder="Ej: Ana Pérez">
        <label>Email</label>
        <input formControlName="email" placeholder="ana@empresa.com">

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || busy()">Crear</button>
          <span class="small" *ngIf="busy()">Procesando...</span>
        </div>
      </form>

      <div class="err" *ngIf="error()">{{ error() }}</div>
    </div>

    <div class="col card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h2>Empleados</h2>
        <button type="button" (click)="load()">Refrescar</button>
      </div>

      <table *ngIf="employees().length; else empty">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Id</th>
            <th>Creado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let e of employees()">
            <td>{{ e.name }}</td>
            <td>{{ e.email }}</td>
            <td><span class="small">{{ e.id }}</span></td>
            <td><span class="small">{{ e.createdAt | date:'short' }}</span></td>
          </tr>
        </tbody>
      </table>

      <ng-template #empty>
        <div class="small">Aún no hay empleados.</div>
      </ng-template>
    </div>
  </div>
  `
})
export class EmployeesPage {
  employees = signal<Employee[]>([]);
  error = signal<string | null>(null);
  busy = signal(false);

  form = null as any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly listUc: ListEmployeesUseCase,
    private readonly createUc: CreateEmployeeUseCase,
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.load();
  }

  load() {
    this.error.set(null);
    this.listUc.execute().subscribe({
      next: (data) => this.employees.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }

  create() {
    if (this.form.invalid) return;
    this.error.set(null);
    this.busy.set(true);

    this.createUc.execute(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset();
        this.busy.set(false);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(String(e?.message ?? e));
      },
    });
  }
}
