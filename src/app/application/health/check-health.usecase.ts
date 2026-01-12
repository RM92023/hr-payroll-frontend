import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../core/http/api-client';

@Injectable({ providedIn: 'root' })
export class CheckHealthUseCase {
  private readonly api = inject(ApiClient);
  execute() {
    return this.api.get<{ status: string }>('/payroll/health');
  }
}
