import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | Observable<boolean> {
    return this.authService.isAuthenticated().then((isAuthenticated) => {
      if (!isAuthenticated) {
        this.authService.signIn();
        return false;
      }
      if (state.url.includes('code=') && state.url.includes('state=')) {
        this.authService.getCurrentUser().then((user) => {
          this.authService
            .auditLogLoginLogout(user?.username || '', 'Login-Success')
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.router.navigate(['/']);
              },
              error: (err) => {
                this.router.navigate(['/']);
              },
            });
        });
      }

      return true;
    });
  }
}
