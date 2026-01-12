import type { Observable } from 'rxjs';
import type { CreateEmployeeDto, Employee } from './employee.model';

export interface EmployeeRepository {
  findAll(): Observable<Employee[]>;
  create(dto: CreateEmployeeDto): Observable<Employee>;
}
