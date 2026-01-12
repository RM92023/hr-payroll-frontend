import { Injectable, inject } from '@angular/core';
import { CONTRACT_REPO } from '../../infrastructure/tokens';
import type { ContractRepository } from '../../domain/contracts/contract.repository';

@Injectable({ providedIn: 'root' })
export class ListContractsUseCase {
  private readonly repo = inject<ContractRepository>(CONTRACT_REPO);
  execute() {
    return this.repo.findAll();
  }
}
