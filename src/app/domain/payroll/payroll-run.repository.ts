import type { Observable } from 'rxjs';
import type { CreatePayrollRunDto, FindPayrollRunsQuery, PayrollRun } from './payroll-run.model';

export interface PayrollRunRepository {
  findAll(query?: FindPayrollRunsQuery): Observable<PayrollRun[]>;
  create(dto: CreatePayrollRunDto): Observable<PayrollRun>;
}
