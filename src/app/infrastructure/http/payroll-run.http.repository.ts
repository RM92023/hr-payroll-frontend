import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/http/api-client';
import type { CreatePayrollRunDto, FindPayrollRunsQuery, PayrollRun } from '../../domain/payroll/payroll-run.model';
import type { PayrollRunRepository } from '../../domain/payroll/payroll-run.repository';

@Injectable()
export class HttpPayrollRunRepository implements PayrollRunRepository {
  constructor(private readonly api: ApiClient) {}
  findAll(query?: FindPayrollRunsQuery): Observable<PayrollRun[]> {
    return this.api.get<PayrollRun[]>('/payroll/runs', query);
  }
  create(dto: CreatePayrollRunDto): Observable<PayrollRun> {
    return this.api.post<PayrollRun>('/payroll/runs', dto);
  }
}
