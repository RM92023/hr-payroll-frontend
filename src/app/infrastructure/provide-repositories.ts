import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CONTRACT_REPO, EMPLOYEE_REPO, PAYROLL_RULE_REPO, PAYROLL_RUN_REPO } from './tokens';
import { HttpEmployeeRepository } from './http/employee.http.repository';
import { HttpContractRepository } from './http/contract.http.repository';
import { HttpPayrollRunRepository } from './http/payroll-run.http.repository';
import { HttpPayrollRuleRepository } from './http/payroll-rule.http.repository';

export function provideRepositories(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: EMPLOYEE_REPO, useClass: HttpEmployeeRepository },
    { provide: CONTRACT_REPO, useClass: HttpContractRepository },
    { provide: PAYROLL_RUN_REPO, useClass: HttpPayrollRunRepository },
    { provide: PAYROLL_RULE_REPO, useClass: HttpPayrollRuleRepository },
  ]);
}
