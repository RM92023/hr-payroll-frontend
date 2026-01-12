import { Component, signal, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';

import type { PayrollRule } from '../../domain/payroll/payroll-rule.model';
import type { ContractType } from '../../domain/shared/contract-type';

import { ListPayrollRulesUseCase } from '../../application/payroll/list-payroll-rules.usecase';
import { CreatePayrollRuleUseCase } from '../../application/payroll/create-payroll-rule.usecase';
import { UpdatePayrollRuleUseCase } from '../../application/payroll/update-payroll-rule.usecase';
import { DeletePayrollRuleUseCase } from '../../application/payroll/delete-payroll-rule.usecase';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, DatePipe, DecimalPipe],
  template: `
  <div class="row">
    <div class="col card">
      <h2>Crear regla de nómina</h2>

      <form [formGroup]="createForm" (ngSubmit)="create()">
        <label for="pr-key">Key</label>
        <input id="pr-key" formControlName="key" placeholder="Ej: employee.healthPct">

        <label for="pr-label">Label</label>
        <input id="pr-label" formControlName="label" placeholder="Ej: Salud empleado">

        <label for="pr-contractType">ContractType (opcional)</label>
        <select id="pr-contractType" formControlName="contractType">
          <option value="">-- aplica a todos --</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="CONTRACTOR">CONTRACTOR</option>
        </select>

        <label for="pr-unit">Unit</label>
        <input id="pr-unit" formControlName="unit" placeholder="Ej: pct | cop | flat">

        <label for="pr-value">Value</label>
        <input id="pr-value" type="number" formControlName="value" placeholder="Ej: 0.04">

        <div class="actions">
          <button type="submit" [disabled]="createForm.invalid || busy()">Crear</button>
          <span class="small" *if="busy()">Procesando...</span>
        </div>
      </form>

      <div class="err" *if="error()">{{ error() }}</div>
    </div>

    <div class="col card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h2>Reglas</h2>
        <button type="button" (click)="load()">Refrescar</button>
      </div>

      <div class="row" style="margin-top:8px;">
        <div class="col" style="flex:1 1 260px;">
          <label for="filter-contractType">Filtro ContractType</label>
          <select id="filter-contractType" [value]="filterContractType() ?? ''" (change)="setFilter($any($event.target).value)">
            <option value="">-- Todas --</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="CONTRACTOR">CONTRACTOR</option>
          </select>
        </div>
        <div class="col" style="flex:0 0 160px; align-self:end;">
          <button type="button" (click)="load()">Aplicar</button>
        </div>
      </div>

      <table *if="rules().length; else empty" style="margin-top:10px;">
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
          <tr *for="let r of rules()">
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

  <div class="card" *if="editing() as r" style="margin-top:14px;">
    <h2>Editar regla</h2>

    <form [formGroup]="editForm" (ngSubmit)="saveEdit()">
      <div class="row">
        <div class="col">
          <label for="edit-label">Label</label>
          <input id="edit-label" formControlName="label">
        </div>
        <div class="col">
          <label for="edit-unit">Unit</label>
          <input id="edit-unit" formControlName="unit">
        </div>
        <div class="col">
          <label for="edit-value">Value</label>
          <input id="edit-value" type="number" formControlName="value">
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label for="edit-contractType">ContractType</label>
          <select id="edit-contractType" formControlName="contractType">
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
export class PayrollRulesPage implements OnInit {
  rules = signal<PayrollRule[]>([]);
  filterContractType = signal<ContractType | undefined>(undefined);

  editing = signal<PayrollRule | null>(null);

  error = signal<string | null>(null);
  busy = signal(false);

  createForm!: import('@angular/forms').FormGroup;
  editForm!: import('@angular/forms').FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly listUc = inject(ListPayrollRulesUseCase);
  private readonly createUc = inject(CreatePayrollRuleUseCase);
  private readonly updateUc = inject(UpdatePayrollRuleUseCase);
  private readonly deleteUc = inject(DeletePayrollRuleUseCase);

  constructor() {
    this.load();
  }
  
  ngOnInit(): void {
    this.createForm = this.fb.nonNullable.group({
      key: ['', [Validators.required]],
      label: ['', [Validators.required]],
      contractType: [''] as unknown as (ContractType | null),
      unit: ['', [Validators.required]],
      value: [0, [Validators.required]],
    });

    this.editForm = this.fb.nonNullable.group({
      label: ['', [Validators.required]],
      contractType: [''] as unknown as (ContractType | null),
      unit: ['', [Validators.required]],
      value: [0, [Validators.required]],
      enabled: [true],
    });

    this.load();
  }

  setFilter(v: string) {
    const next = (v && v.length) ? (v as ContractType) : undefined;
    this.filterContractType.set(next);
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
      contractType: (raw.contractType || null) as (ContractType | null),
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
      contractType: (raw.contractType || null) as (ContractType | null),
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
