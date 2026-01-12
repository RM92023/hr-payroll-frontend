import { Routes } from '@angular/router';
import { EmployeesPage } from '../presentation/pages/employees.page';
import { ContractsPage } from '../presentation/pages/contracts.page';
import { PayrollRunsPage } from '../presentation/pages/payroll-runs.page';
import { PayrollRulesPage } from '../presentation/pages/payroll-rules.page';
import { HealthPage } from '../presentation/pages/health.page';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employees' },

  { path: 'employees', component: EmployeesPage, title: 'Employees' },
  { path: 'contracts', component: ContractsPage, title: 'Contracts' },
  { path: 'payroll/runs', component: PayrollRunsPage, title: 'Payroll Runs' },
  { path: 'payroll/rules', component: PayrollRulesPage, title: 'Payroll Rules' },
  { path: 'health', component: HealthPage, title: 'Health' },

  { path: '**', redirectTo: 'employees' },
];
