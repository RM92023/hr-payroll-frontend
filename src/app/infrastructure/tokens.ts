import { InjectionToken } from '@angular/core';
import type { EmployeeRepository } from '../domain/employees/employee.repository';
import type { ContractRepository } from '../domain/contracts/contract.repository';
import type { PayrollRunRepository } from '../domain/payroll/payroll-run.repository';
import type { PayrollRuleRepository } from '../domain/payroll/payroll-rule.repository';

export const EMPLOYEE_REPO = new InjectionToken<EmployeeRepository>('EMPLOYEE_REPO');
export const CONTRACT_REPO = new InjectionToken<ContractRepository>('CONTRACT_REPO');
export const PAYROLL_RUN_REPO = new InjectionToken<PayrollRunRepository>('PAYROLL_RUN_REPO');
export const PAYROLL_RULE_REPO = new InjectionToken<PayrollRuleRepository>('PAYROLL_RULE_REPO');
