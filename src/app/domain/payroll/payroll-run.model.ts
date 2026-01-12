import type { Employee } from '../employees/employee.model';
import type { Contract } from '../contracts/contract.model';

export interface PayrollRun {
  id: string;
  employeeId: string;
  contractId: string;
  period: string; // YYYY-MM
  gross: number;
  net: number;
  breakdown: Record<string, number>;
  createdAt: string;

  employee?: Employee;
  contract?: Contract;
}

export interface CreatePayrollRunDto {
  employeeId: string;
  period: string;
  contractId?: string;
  bonuses?: number;
  otherDeductions?: number;
}

export interface FindPayrollRunsQuery {
  employeeId?: string;
  period?: string;
}
