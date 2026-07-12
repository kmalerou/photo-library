import { Routes } from '@angular/router';

import { photoExistsGuard } from './features/photo-detail/photo-exists-guard';
import { PhotoStream } from './features/photo-stream/photo-stream';

export const routes: Routes = [
  {
    path: '',
    component: PhotoStream,
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
