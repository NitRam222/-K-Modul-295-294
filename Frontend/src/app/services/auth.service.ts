import { Injectable, inject } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

const authConfig: AuthConfig = {
  issuer: environment.keycloakIssuer,
  redirectUri: window.location.origin + '/',
  postLogoutRedirectUri: window.location.origin + '/',
  clientId: environment.keycloakClientId,
  responseType: 'code',
  scope: environment.keycloakScope,
  oidc: true,
  disablePKCE: false,
  showDebugInformation: !environment.production,
  strictDiscoveryDocumentValidation: false,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oauthService = inject(OAuthService);

  constructor() {
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
  }

  initialize() {
    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => true)
      .catch(() => true);
  }

  login() {
    this.oauthService.initCodeFlow();
  }
  logout() {
    this.oauthService.logOut();
  }

  get accessToken() {
    return this.oauthService.getAccessToken();
  }
  get isAuthenticated() {
    return this.oauthService.hasValidAccessToken();
  }
  get identityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  get accessTokenClaims(): any {
    const token = this.accessToken;
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  get username() {
    const c = this.identityClaims || this.accessTokenClaims;
    return c?.preferred_username || c?.name || c?.sub || '';
  }

  get displayName() {
    const c = this.identityClaims || this.accessTokenClaims;
    return c?.name || c?.preferred_username || 'Gast';
  }

  get email() {
    return this.identityClaims?.email || this.accessTokenClaims?.email || '';
  }

  get sub(): string {
    const c = this.accessTokenClaims || this.identityClaims;
    return c?.sub || '';
  }

  get roles(): string[] {
    const c = this.accessTokenClaims || this.identityClaims;
    if (!c) return [];
    const roles = new Set<string>();
    const add = (r: any) => {
      if (Array.isArray(r))
        r.forEach((v) => roles.add(String(v).toLowerCase()));
      else if (typeof r === 'string') roles.add(r.toLowerCase());
    };
    add(c.realm_access?.roles);
    if (c.resource_access) {
      Object.values(c.resource_access).forEach((cl: any) => add(cl?.roles));
    }
    add(c.roles);
    add(c.role);
    return Array.from(roles);
  }

  hasRole(role: string) {
    return this.roles.includes(role.toLowerCase());
  }
}
