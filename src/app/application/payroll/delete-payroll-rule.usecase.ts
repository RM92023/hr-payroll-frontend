import { Injectable, inject } from '@angular/core';
import { PAYROLL_RULE_REPO } from '../../infrastructure/tokens';
import type { PayrollRuleRepository } from '../../domain/payroll/payroll-rule.repository';

@Injectable({ providedIn: 'root' })
export class DeletePayrollRuleUseCase {
  private readonly repo = inject<PayrollRuleRepository>(PAYROLL_RULE_REPO);
  execute(id: string) {
    return this.repo.delete(id);
  }
}
