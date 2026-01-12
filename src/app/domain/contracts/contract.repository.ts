import type { Observable } from 'rxjs';
import type { Contract, CreateContractDto } from './contract.model';

export interface ContractRepository {
  findAll(): Observable<Contract[]>;
  create(dto: CreateContractDto): Observable<Contract>;
}
