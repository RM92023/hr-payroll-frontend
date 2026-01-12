import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/http/api-client';
import type { CreateEmployeeDto, Employee } from '../../domain/employees/employee.model';
import type { EmployeeRepository } from '../../domain/employees/employee.repository';

@Injectable()
export class HttpEmployeeRepository implements EmployeeRepository {
  private readonly api = inject(ApiClient);
  findAll(): Observable<Employee[]> {
    return this.api.get<Employee[]>('/employees');
  }
  create(dto: CreateEmployeeDto): Observable<Employee> {
    return this.api.post<Employee>('/employees', dto);
  }
}
