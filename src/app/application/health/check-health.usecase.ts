import { Injectable } from '@angular/core';
import { ApiClient } from '../../core/http/api-client';

@Injectable({ providedIn: 'root' })
export class CheckHealthUseCase {
  constructor(private readonly api: ApiClient) {}
  execute() {
    return this.api.get<{ status: string }>('/payroll/health');
  }
}
