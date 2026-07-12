import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { photoExistsGuard } from './features/photo-detail/photo-exists-guard';
import { PhotoStream } from './features/photo-stream/photo-stream';
import { photoStreamEffects } from './features/photo-stream/store/photo-stream.effects';
import { photoStreamFeature } from './features/photo-stream/store/photo-stream.reducer';

export const routes: Routes = [
  {
    path: '',
    component: PhotoStream,
    providers: [provideState(photoStreamFeature), provideEffects(photoStreamEffects)],
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites').then((m) => m.Favorites),
  },
  {
    path: 'photos/:id',
    canActivate: [photoExistsGuard],
    loadComponent: () =>
      import('./features/photo-detail/photo-detail').then((m) => m.PhotoDetail),
  },
];
