import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/http/api-client';
import type { CreatePayrollRuleDto, FindPayrollRulesQuery, PayrollRule, UpdatePayrollRuleDto } from '../../domain/payroll/payroll-rule.model';
import type { PayrollRuleRepository } from '../../domain/payroll/payroll-rule.repository';

@Injectable()
export class HttpPayrollRuleRepository implements PayrollRuleRepository {
  constructor(private readonly api: ApiClient) {}

  findAll(query?: FindPayrollRulesQuery): Observable<PayrollRule[]> {
    return this.api.get<PayrollRule[]>('/payroll/rules', query);
  }
  findById(id: string): Observable<PayrollRule> {
    return this.api.get<PayrollRule>(`/payroll/rules/${id}`);
  }
  create(dto: CreatePayrollRuleDto): Observable<PayrollRule> {
    return this.api.post<PayrollRule>('/payroll/rules', dto);
  }
  update(id: string, dto: UpdatePayrollRuleDto): Observable<PayrollRule> {
    return this.api.put<PayrollRule>(`/payroll/rules/${id}`, dto);
  }
  delete(id: string): Observable<PayrollRule> {
    return this.api.delete<PayrollRule>(`/payroll/rules/${id}`);
  }
}
