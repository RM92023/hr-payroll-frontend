import type { ContractType } from '../shared/contract-type';

export interface PayrollRule {
  id: string;
  createdAt: string;
  updatedAt: string;

  key: string;
  label: string;
  contractType?: ContractType | null;
  unit: string;
  value: number;
  enabled: boolean;
}

export interface CreatePayrollRuleDto {
  key: string;
  label: string;
  contractType?: ContractType | null;
  unit: string;
  value: number;
}

export interface UpdatePayrollRuleDto {
  key?: string;
  label?: string;
  contractType?: ContractType | null;
  unit?: string;
  value?: number;
  enabled?: boolean;
}

export interface FindPayrollRulesQuery {
  contractType?: ContractType;
}
