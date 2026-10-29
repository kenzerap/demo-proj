import { inject, Injectable } from '@angular/core';
import * as Auth from '@aws-amplify/auth';
import { from, lastValueFrom, Observable, of, switchMap, take } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly http: HttpClient = inject(HttpClient);

  async signIn(): Promise<void> {
    try {
      await Auth.signInWithRedirect();
    } catch (error) {
      throw new Error('Error during sign-in: ' + error);
    }
  }

  async signOut(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    lastValueFrom(this.auditLogLoginLogout(currentUser?.username || '', 'Logout'));

    try {
      const dynamicParams = new URLSearchParams();
      dynamicParams.append(
        'client_id',
        environment.awsAuth.Cognito.userPoolClientId
      );
      dynamicParams.append(
        'response_type',
        environment.awsAuth.Cognito.loginWith.oauth.responseType
      );
      dynamicParams.append(
        'redirect_uri',
        environment.awsAuth.Cognito.loginWith.oauth.redirectSignOut[0]
      );
      dynamicParams.append(
        'logout_uri',
        environment.awsAuth.Cognito.loginWith.oauth.redirectSignOut[0]
      );

      const domain = environment.awsAuth.Cognito.loginWith.oauth.domain;

      const logoutUrl = `https://${domain}/logout?${dynamicParams.toString()}`;
      localStorage.clear();
      sessionStorage.clear();
      window.open(logoutUrl, '_self');
    } catch (error) {
      throw new Error('Error during sign-out: ' + error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const session = await Auth.fetchAuthSession();
    if (!session.tokens) {
      return null;
    }

    try {
      const jwtDecode = Auth.decodeJWT(
        session.tokens?.idToken?.toString() || ''
      );

      return {
        id: jwtDecode.payload.sub || '',
        name: jwtDecode.payload['name']?.toString() || '',
        email: jwtDecode.payload['email']?.toString() || '',
        username: jwtDecode.payload['preferred_username']?.toString() || '',
      };
    } catch (error) {
      throw new Error('Error during get current user: ' + error);
    }
  }

  getCurrentUser$(): Observable<User | null> {
    try {
      const session = from(Auth.fetchAuthSession());

      return session.pipe(
        switchMap((session) => {
          if (!session.tokens) {
            return of(null);
          }

          const jwtDecode = Auth.decodeJWT(
            session.tokens?.idToken?.toString() || ''
          );

          return of({
            id: jwtDecode.payload.sub || '',
            name: jwtDecode.payload['name']?.toString() || '',
            email: jwtDecode.payload['email']?.toString() || '',
            username: jwtDecode.payload['preferred_username']?.toString() || '',
          });
        })
      );
    } catch (error) {
      throw new Error('Error during get current user: ' + error);
    }
  }

  getToken(): Observable<string | null> {
    try {
      const session = from(Auth.fetchAuthSession());

      return session.pipe(
        switchMap((session) => {
          if (!session.tokens) {
            return of(null);
          }

          return of(session.tokens?.idToken?.toString() || null);
        })
      );
    } catch (error) {
      throw new Error('Error during get token: ' + error);
    }
  }

  async isAuthenticated() {
    const session = await Auth.fetchAuthSession();
    return !!session.tokens;

    // dummy data
    // return true;
  }

  auditLogLoginLogout(
    user_name: string,
    action_status: 'Login-Success' | 'Login-Failed' | 'Logout'
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/audit-log/login-logout`, {
      user_name,
      action_status,
    });
  }
}
