import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleUsageListComponent } from './vehicle-usage-list.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { authConfig } from '../../../app/app.config';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { provideTranslateService } from '@ngx-translate/core';

describe('VehicleUsageListComponent', () => {
  let component: VehicleUsageListComponent;
  let fixture: ComponentFixture<VehicleUsageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        MatSnackBarModule,
        VehicleUsageListComponent,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthConfig, useValue: authConfig },
        provideTranslateService({
          fallbackLang: 'en',
          lang: 'en'
        }),
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleUsageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
