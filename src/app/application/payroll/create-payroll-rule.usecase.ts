import { Injectable, inject } from '@angular/core';
import { PAYROLL_RULE_REPO } from '../../infrastructure/tokens';
import type { PayrollRuleRepository } from '../../domain/payroll/payroll-rule.repository';
import type { CreatePayrollRuleDto } from '../../domain/payroll/payroll-rule.model';

@Injectable({ providedIn: 'root' })
export class CreatePayrollRuleUseCase {
  private readonly repo = inject<PayrollRuleRepository>(PAYROLL_RULE_REPO);
  execute(dto: CreatePayrollRuleDto) {
    return this.repo.create(dto);
  }
}
