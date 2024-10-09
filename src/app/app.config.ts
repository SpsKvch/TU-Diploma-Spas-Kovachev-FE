import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";

export const appConfig: ApplicationConfig = {
providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync('animations'),
            provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
};
