import { Injectable, inject } from '@angular/core';
import { PAYROLL_RUN_REPO } from '../../infrastructure/tokens';
import type { PayrollRunRepository } from '../../domain/payroll/payroll-run.repository';
import type { FindPayrollRunsQuery } from '../../domain/payroll/payroll-run.model';

@Injectable({ providedIn: 'root' })
export class ListPayrollRunsUseCase {
  private readonly repo = inject<PayrollRunRepository>(PAYROLL_RUN_REPO);
  execute(query?: FindPayrollRunsQuery) {
    return this.repo.findAll(query);
  }
}
