import { Injectable, inject } from '@angular/core';
import { PAYROLL_RULE_REPO } from '../../infrastructure/tokens';
import type { PayrollRuleRepository } from '../../domain/payroll/payroll-rule.repository';
import type { FindPayrollRulesQuery } from '../../domain/payroll/payroll-rule.model';

@Injectable({ providedIn: 'root' })
export class ListPayrollRulesUseCase {
  private readonly repo = inject<PayrollRuleRepository>(PAYROLL_RULE_REPO);
  execute(query?: FindPayrollRulesQuery) {
    return this.repo.findAll(query);
  }
}
