import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/http/api-client';
import type { Contract, CreateContractDto } from '../../domain/contracts/contract.model';
import type { ContractRepository } from '../../domain/contracts/contract.repository';

@Injectable()
export class HttpContractRepository implements ContractRepository {
  private readonly api = inject(ApiClient);
  findAll(): Observable<Contract[]> {
    return this.api.get<Contract[]>('/contracts');
  }
  create(dto: CreateContractDto): Observable<Contract> {
    return this.api.post<Contract>('/contracts', dto);
  }
}
