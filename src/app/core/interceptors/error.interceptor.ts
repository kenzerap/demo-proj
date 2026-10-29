import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.signOut();
        return throwError(() => error);
      }

      if (!error.error?.errors) {
        error = {
          ...error,
          error: {
            ...error.error,
            errors: [
              {
                message: 'API Undefined error',
                error_code: 'Something went wrong',
              },
            ],
            status_code: error.status,
          },
        };
        return throwError(() => error);
      }

      if (window.navigator.onLine === false) {
        // handle offline error
      }

      // For other errors, rethrow the error
      return throwError(() => error);
    })
  );
};
