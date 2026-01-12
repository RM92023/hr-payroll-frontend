import { Injectable, inject } from '@angular/core';
import { PAYROLL_RULE_REPO } from '../../infrastructure/tokens';
import type { PayrollRuleRepository } from '../../domain/payroll/payroll-rule.repository';
import type { UpdatePayrollRuleDto } from '../../domain/payroll/payroll-rule.model';

@Injectable({ providedIn: 'root' })
export class UpdatePayrollRuleUseCase {
  private readonly repo = inject<PayrollRuleRepository>(PAYROLL_RULE_REPO);
  execute(id: string, dto: UpdatePayrollRuleDto) {
    return this.repo.update(id, dto);
  }
}
