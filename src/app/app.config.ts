import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { addFavorite$, removeFavorite$ } from './features/favorites/store/favorites.effects';
import { favoritesFeature } from './features/favorites/store/favorites.reducer';
import { loadPhotos$ } from './features/photo-stream/store/photo-stream.effects';
import { photoStreamFeature } from './features/photo-stream/store/photo-stream.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore(),
    provideState(photoStreamFeature),
    provideState(favoritesFeature),
    provideEffects({ loadPhotos$, addFavorite$, removeFavorite$ }),
    ...environment.devtoolsProviders,
  ],
};
