import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { switchMap } from 'rxjs';
import { HttpHeaderAuthorization } from '@app/shared/utils/enums/http-header-authorization.enum';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authHeader = req.headers.get('Authorization');
  if (authHeader === HttpHeaderAuthorization.NoAuth) {
    return next(
      req.clone({
        headers: req.headers.delete('Authorization'),
      })
    );
  }

  return authService.getToken().pipe(
    switchMap((token) => {
      const modifiedReq = token
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        : req;

      return next(modifiedReq);
    })
  );
};
