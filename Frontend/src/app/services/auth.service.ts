import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig, OAuthEvent } from 'angular-oauth2-oidc';
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
  strictDiscoveryDocumentValidation: false
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
  }

  initialize(): Promise<boolean> {
    return this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => true).catch(() => true);
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  get accessToken(): string | null {
    return this.oauthService.getAccessToken() || null;
  }

  get isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get identityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  private parseTokenClaims(token: string | null): any {
    if (!token) {
      return null;
    }

    try {
      const base64 = token.split('.')[1];
      const json = decodeURIComponent(
        Array.prototype.map
          .call(atob(base64.replace(/-/g, '+').replace(/_/g, '/')), (c: string) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  get accessTokenClaims(): any {
    return this.parseTokenClaims(this.accessToken);
  }

  get username(): string {
    return this.identityClaims?.preferred_username || this.identityClaims?.name || this.identityClaims?.sub || this.identityClaims?.email ||
           this.accessTokenClaims?.preferred_username || this.accessTokenClaims?.name || this.accessTokenClaims?.sub || this.accessTokenClaims?.email || '';
  }

  get displayName(): string {
    return this.identityClaims?.name || this.identityClaims?.preferred_username || this.identityClaims?.email || this.identityClaims?.sub ||
           this.accessTokenClaims?.name || this.accessTokenClaims?.preferred_username || this.accessTokenClaims?.email || this.accessTokenClaims?.sub || 'Gast';
  }

  get email(): string {
    return this.identityClaims?.email || this.accessTokenClaims?.email || '';
  }

  get roles(): string[] {
    const claims = this.accessTokenClaims || this.identityClaims;
    const roleSet = new Set<string>();

    const addRoles = (roles: any) => {
      if (Array.isArray(roles)) {
        roles.forEach((role) => {
          if (role) {
            roleSet.add(String(role).toLowerCase());
          }
        });
      }
    };

    addRoles(claims?.realm_access?.roles);

    const resourceAccess = claims?.resource_access;
    if (resourceAccess && typeof resourceAccess === 'object') {
      Object.values(resourceAccess).forEach((client: any) => {
        addRoles(client?.roles);
      });
    }

    return Array.from(roleSet);
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role.toLowerCase());
  }
}
