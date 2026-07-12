import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Snackbar } from '@core/snackbar';

import { favoritesFeature } from '../favorites/store/favorites.reducer';

export const photoExistsGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);
  const snackbar = inject(Snackbar);

  const id = route.paramMap.get('id');
  const entities = store.selectSignal(favoritesFeature.selectEntities)();

  if (id && id in entities) {
    return true;
  }

  snackbar.open('Photo not found', 'warn');
  return router.parseUrl('/favorites');
};
