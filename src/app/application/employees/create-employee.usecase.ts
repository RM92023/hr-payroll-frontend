import { Injectable, inject } from '@angular/core';
import { EMPLOYEE_REPO } from '../../infrastructure/tokens';
import type { EmployeeRepository } from '../../domain/employees/employee.repository';
import type { CreateEmployeeDto } from '../../domain/employees/employee.model';

@Injectable({ providedIn: 'root' })
export class CreateEmployeeUseCase {
  private readonly repo = inject<EmployeeRepository>(EMPLOYEE_REPO);
  execute(dto: CreateEmployeeDto) {
    return this.repo.create(dto);
  }
}
