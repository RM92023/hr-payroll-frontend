import type { ContractType } from '../shared/contract-type';

export interface Contract {
  id: string;
  employeeId: string;
  contractType: ContractType;
  baseSalary: number;
  active: boolean;
  createdAt: string;
}

export interface CreateContractDto {
  employeeId: string;
  contractType: ContractType;
  baseSalary: number;
  active?: boolean;
}
