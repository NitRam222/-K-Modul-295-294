import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';

export function initializeAuth(
  authService: AuthService,
): () => Promise<boolean> {
  return () => authService.initialize();
}

export const appConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: [environment.backendBaseUrl],
          sendAccessToken: true,
        },
      }),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
};
