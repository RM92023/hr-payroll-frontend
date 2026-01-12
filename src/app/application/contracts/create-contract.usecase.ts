import { Injectable, inject } from '@angular/core';
import { CONTRACT_REPO } from '../../infrastructure/tokens';
import type { ContractRepository } from '../../domain/contracts/contract.repository';
import type { CreateContractDto } from '../../domain/contracts/contract.model';

@Injectable({ providedIn: 'root' })
export class CreateContractUseCase {
  private readonly repo = inject<ContractRepository>(CONTRACT_REPO);
  execute(dto: CreateContractDto) {
    return this.repo.create(dto);
  }
}
