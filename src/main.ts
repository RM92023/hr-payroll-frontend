import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/presentation/app.component';
import { APP_ROUTES } from './app/presentation/app.routes';
import { API_BASE_URL } from './app/core/http/api-base-url.token';
import { environment } from './environments/environment';
import { errorInterceptor } from './app/core/http/error.interceptor';

import { provideRepositories } from './app/infrastructure/provide-repositories';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([errorInterceptor])),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideRepositories(),
  ],
}).catch((err) => console.error(err));
