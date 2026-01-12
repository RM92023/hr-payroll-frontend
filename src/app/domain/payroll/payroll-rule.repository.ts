import type { Observable } from 'rxjs';
import type { CreatePayrollRuleDto, FindPayrollRulesQuery, PayrollRule, UpdatePayrollRuleDto } from './payroll-rule.model';

export interface PayrollRuleRepository {
  findAll(query?: FindPayrollRulesQuery): Observable<PayrollRule[]>;
  findById(id: string): Observable<PayrollRule>;
  create(dto: CreatePayrollRuleDto): Observable<PayrollRule>;
  update(id: string, dto: UpdatePayrollRuleDto): Observable<PayrollRule>;
  delete(id: string): Observable<PayrollRule>;
}
