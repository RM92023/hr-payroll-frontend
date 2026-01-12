import { Injectable, inject } from '@angular/core';
import { PAYROLL_RUN_REPO } from '../../infrastructure/tokens';
import type { PayrollRunRepository } from '../../domain/payroll/payroll-run.repository';
import type { CreatePayrollRunDto } from '../../domain/payroll/payroll-run.model';

@Injectable({ providedIn: 'root' })
export class CreatePayrollRunUseCase {
  private readonly repo = inject<PayrollRunRepository>(PAYROLL_RUN_REPO);
  execute(dto: CreatePayrollRunDto) {
    return this.repo.create(dto);
  }
}
