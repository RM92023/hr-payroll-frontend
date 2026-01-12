import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';

import type { Contract } from '../../domain/contracts/contract.model';
import type { Employee } from '../../domain/employees/employee.model';
import type { ContractType } from '../../domain/shared/contract-type';

import { ListEmployeesUseCase } from '../../application/employees/list-employees.usecase';
import { ListContractsUseCase } from '../../application/contracts/list-contracts.usecase';
import { CreateContractUseCase } from '../../application/contracts/create-contract.usecase';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, DatePipe, DecimalPipe],
  template: `
  <div class="row">
    <div class="col card">
      <h2>Crear contrato</h2>

      <form [formGroup]="form" (ngSubmit)="create()">
        <label for="employeeId">Empleado</label>
        <select id="employeeId" formControlName="employeeId">
          <option value="">-- Selecciona --</option>
          <option *for="let e of employees()" [value]="e.id">{{ e.name }} ({{ e.email }})</option>
        </select>

        <label for="contractType">Tipo de contrato</label>
        <select id="contractType" formControlName="contractType">
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="CONTRACTOR">CONTRACTOR</option>
        </select>

        <label for="baseSalary">Salario base</label>
        <input id="baseSalary" type="number" formControlName="baseSalary" placeholder="Ej: 3000000">

        <label style="display:flex; align-items:center; gap:10px; margin-top:12px;">
          <input type="checkbox" formControlName="active" style="width:auto">
          <span>Activo</span>
        </label>

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || busy()">Crear</button>
          <span class="small" *if="busy()">Procesando...</span>
        </div>
      </form>

      <div class="err" *if="error()">{{ error() }}</div>
    </div>

    <div class="col card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h2>Contratos</h2>
        <button type="button" (click)="load()">Refrescar</button>
      </div>

      <table *if="contracts().length; else empty">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Tipo</th>
            <th>Salario</th>
            <th>Activo</th>
            <th>Id</th>
            <th>Creado</th>
          </tr>
        </thead>
        <tbody>
          <tr *for="let c of contracts()">
            <td>
              <span class="small">{{ employeeName(c.employeeId) }}</span>
            </td>
            <td><span class="pill">{{ c.contractType }}</span></td>
            <td>{{ c.baseSalary | number }}</td>
            <td>
              <span class="pill" [class.ok]="c.active" [class.bad]="!c.active">
                {{ c.active ? 'Sí' : 'No' }}
              </span>
            </td>
            <td><span class="small">{{ c.id }}</span></td>
            <td><span class="small">{{ c.createdAt | date:'short' }}</span></td>
          </tr>
        </tbody>
      </table>

      <ng-template #empty>
        <div class="small">Aún no hay contratos.</div>
      </ng-template>
    </div>
  </div>
  `
})
export class ContractsPage implements OnInit {
  employees = signal<Employee[]>([]);
  contracts = signal<Contract[]>([]);
  error = signal<string | null>(null);
  busy = signal(false);

  form!: import('@angular/forms').FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly listEmployees = inject(ListEmployeesUseCase);
  private readonly listContracts = inject(ListContractsUseCase);
  private readonly createContract = inject(CreateContractUseCase);

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      employeeId: ['', [Validators.required]],
      contractType: ['EMPLOYEE' as unknown as ContractType, [Validators.required]],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      active: [true],
    });
    this.load();
  }

  load() {
    this.error.set(null);

    this.listEmployees.execute().subscribe({
      next: (data) => this.employees.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });

    this.listContracts.execute().subscribe({
      next: (data) => this.contracts.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }

  employeeName(employeeId: string) {
    const e = this.employees().find(x => x.id === employeeId);
    return e ? `${e.name} — ${e.email}` : employeeId;
  }

  create() {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set(null);

    this.createContract.execute(this.form.getRawValue()).subscribe({
      next: () => {
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
