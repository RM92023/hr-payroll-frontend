import { Injectable, inject } from '@angular/core';
import { EMPLOYEE_REPO } from '../../infrastructure/tokens';
import type { EmployeeRepository } from '../../domain/employees/employee.repository';

@Injectable({ providedIn: 'root' })
export class ListEmployeesUseCase {
  private readonly repo = inject<EmployeeRepository>(EMPLOYEE_REPO);
  execute() {
    return this.repo.findAll();
  }
}
