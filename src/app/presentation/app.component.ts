import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="nav">
      <div class="bar">
        <div class="brand">HR Payroll UI</div>
        <div class="links">
          <a class="link" routerLink="/employees" routerLinkActive="active">Employees</a>
          <a class="link" routerLink="/contracts" routerLinkActive="active">Contracts</a>
          <a class="link" routerLink="/payroll/runs" routerLinkActive="active">Payroll Runs</a>
          <a class="link" routerLink="/payroll/rules" routerLinkActive="active">Payroll Rules</a>
          <a class="link" routerLink="/health" routerLinkActive="active">Health</a>
        </div>
      </div>
    </div>

    <div class="container">
      <router-outlet></router-outlet>
      <div class="small" style="margin-top:18px; opacity:.85">
        Backend: ajusta <code>src/environments/environment.ts</code> → <b>apiBaseUrl</b>
      </div>
    </div>
  `,
})
export class AppComponent {}
