import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { favoritesEffects } from './features/favorites/store/favorites.effects';
import { favoritesFeature } from './features/favorites/store/favorites.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore(),
    provideState(favoritesFeature),
    provideEffects(favoritesEffects),
    ...environment.devtoolsProviders,
  ],
};
