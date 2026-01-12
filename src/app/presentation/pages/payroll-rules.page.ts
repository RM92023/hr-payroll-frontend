import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf, DatePipe } from '@angular/common';

import type { PayrollRule } from '../../domain/payroll/payroll-rule.model';
import type { ContractType } from '../../domain/shared/contract-type';

import { ListPayrollRulesUseCase } from '../../application/payroll/list-payroll-rules.usecase';
import { CreatePayrollRuleUseCase } from '../../application/payroll/create-payroll-rule.usecase';
import { UpdatePayrollRuleUseCase } from '../../application/payroll/update-payroll-rule.usecase';
import { DeletePayrollRuleUseCase } from '../../application/payroll/delete-payroll-rule.usecase';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, DatePipe],
  template: `
  <div class="row">
    <div class="col card">
      <h2>Crear regla de nómina</h2>

      <form [formGroup]="createForm" (ngSubmit)="create()">
        <label>Key</label>
        <input formControlName="key" placeholder="Ej: employee.healthPct">

        <label>Label</label>
        <input formControlName="label" placeholder="Ej: Salud empleado">

        <label>ContractType (opcional)</label>
        <select formControlName="contractType">
          <option value="">-- aplica a todos --</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="CONTRACTOR">CONTRACTOR</option>
        </select>

        <label>Unit</label>
        <input formControlName="unit" placeholder="Ej: pct | cop | flat">

        <label>Value</label>
        <input type="number" formControlName="value" placeholder="Ej: 0.04">

        <div class="actions">
          <button type="submit" [disabled]="createForm.invalid || busy()">Crear</button>
          <span class="small" *ngIf="busy()">Procesando...</span>
        </div>
      </form>

      <div class="err" *ngIf="error()">{{ error() }}</div>
    </div>

    <div class="col card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h2>Reglas</h2>
        <button type="button" (click)="load()">Refrescar</button>
      </div>

      <div class="row" style="margin-top:8px;">
        <div class="col" style="flex:1 1 260px;">
          <label>Filtro ContractType</label>
          <select [value]="filterContractType() ?? ''" (change)="setFilter($any($event.target).value)">
            <option value="">-- Todas --</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="CONTRACTOR">CONTRACTOR</option>
          </select>
        </div>
        <div class="col" style="flex:0 0 160px; align-self:end;">
          <button type="button" (click)="load()">Aplicar</button>
        </div>
      </div>

      <table *ngIf="rules().length; else empty" style="margin-top:10px;">
        <thead>
          <tr>
            <th>Key</th>
            <th>Label</th>
            <th>Type</th>
            <th>Unit</th>
            <th>Value</th>
            <th>Enabled</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let r of rules()">
            <td><span class="small">{{ r.key }}</span></td>
            <td>{{ r.label }}</td>
            <td><span class="pill">{{ r.contractType ?? 'ALL' }}</span></td>
            <td><span class="pill">{{ r.unit }}</span></td>
            <td>{{ r.value }}</td>
            <td>
              <span class="pill" [class.ok]="r.enabled" [class.bad]="!r.enabled">
                {{ r.enabled ? 'Sí' : 'No' }}
              </span>
            </td>
            <td style="white-space:nowrap;">
              <button type="button" (click)="startEdit(r)">Editar</button>
              <button type="button" class="danger" (click)="remove(r)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #empty>
        <div class="small">Aún no hay reglas. Si tu backend no tiene tabla <code>PayrollRule</code>, estos endpoints pueden fallar.</div>
      </ng-template>
    </div>
  </div>

  <div class="card" *ngIf="editing() as r" style="margin-top:14px;">
    <h2>Editar regla</h2>

    <form [formGroup]="editForm" (ngSubmit)="saveEdit()">
      <div class="row">
        <div class="col">
          <label>Label</label>
          <input formControlName="label">
        </div>
        <div class="col">
          <label>Unit</label>
          <input formControlName="unit">
        </div>
        <div class="col">
          <label>Value</label>
          <input type="number" formControlName="value">
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label>ContractType</label>
          <select formControlName="contractType">
            <option value="">-- ALL --</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="CONTRACTOR">CONTRACTOR</option>
          </select>
        </div>
        <div class="col" style="display:flex; align-items:end;">
          <label style="display:flex; align-items:center; gap:10px; margin:0;">
            <input type="checkbox" formControlName="enabled" style="width:auto">
            <span>Enabled</span>
          </label>
        </div>
      </div>

      <div class="actions">
        <button type="submit" [disabled]="editForm.invalid || busy()">Guardar</button>
        <button type="button" class="danger" (click)="cancelEdit()">Cancelar</button>
      </div>
    </form>
  </div>
  `
})
export class PayrollRulesPage {
  rules = signal<PayrollRule[]>([]);
  filterContractType = signal<ContractType | undefined>(undefined);

  editing = signal<PayrollRule | null>(null);

  error = signal<string | null>(null);
  busy = signal(false);

  createForm = null as any;
  editForm = null as any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly listUc: ListPayrollRulesUseCase,
    private readonly createUc: CreatePayrollRuleUseCase,
    private readonly updateUc: UpdatePayrollRuleUseCase,
    private readonly deleteUc: DeletePayrollRuleUseCase,
  ) {
    this.createForm = this.fb.nonNullable.group({
      key: ['', [Validators.required]],
      label: ['', [Validators.required]],
      contractType: [''] as any,
      unit: ['', [Validators.required]],
      value: [0, [Validators.required]],
    });

    this.editForm = this.fb.nonNullable.group({
      label: ['', [Validators.required]],
      contractType: [''] as any,
      unit: ['', [Validators.required]],
      value: [0, [Validators.required]],
      enabled: [true],
    });

    this.load();
  }

  setFilter(v: string) {
    this.filterContractType.set((v || undefined) as any);
  }

  load() {
    this.error.set(null);
    this.listUc.execute({ contractType: this.filterContractType() }).subscribe({
      next: (data) => this.rules.set(data),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }

  create() {
    if (this.createForm.invalid) return;
    this.busy.set(true);
    this.error.set(null);

    const raw = this.createForm.getRawValue();
    const dto = {
      key: raw.key,
      label: raw.label,
      contractType: (raw.contractType || null) as any,
      unit: raw.unit,
      value: Number(raw.value),
    };

    this.createUc.execute(dto).subscribe({
      next: () => {
        this.busy.set(false);
        this.createForm.reset({ key: '', label: '', contractType: '', unit: '', value: 0 });
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(String(e?.message ?? e));
      },
    });
  }

  startEdit(rule: PayrollRule) {
    this.editing.set(rule);
    this.editForm.reset({
      label: rule.label,
      contractType: rule.contractType ?? '',
      unit: rule.unit,
      value: rule.value,
      enabled: rule.enabled,
    });
  }

  cancelEdit() {
    this.editing.set(null);
  }

  saveEdit() {
    const r = this.editing();
    if (!r || this.editForm.invalid) return;

    this.busy.set(true);
    this.error.set(null);

    const raw = this.editForm.getRawValue();
    const dto = {
      label: raw.label,
      contractType: (raw.contractType || null) as any,
      unit: raw.unit,
      value: Number(raw.value),
      enabled: !!raw.enabled,
    };

    this.updateUc.execute(r.id, dto).subscribe({
      next: () => {
        this.busy.set(false);
        this.editing.set(null);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(String(e?.message ?? e));
      },
    });
  }

  remove(rule: PayrollRule) {
    if (!confirm(`Eliminar regla "${rule.key}"?`)) return;
    this.busy.set(true);
    this.error.set(null);

    this.deleteUc.execute(rule.id).subscribe({
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
