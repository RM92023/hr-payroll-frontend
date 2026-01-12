import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const msg =
          typeof err.error === 'string'
            ? err.error
            : JSON.stringify(err.error ?? { message: err.message }, null, 2);

        const enriched = new Error(
          `[${err.status}] ${req.method} ${req.url}\n${msg}`,
        );
        return throwError(() => enriched);
      }
      return throwError(() => err);
    }),
  );
};
