import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take, withLatestFrom } from 'rxjs';

import { Snackbar } from '@core/snackbar';

import { favoritesFeature } from '../favorites/store/favorites.reducer';

export const photoExistsGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);
  const snackbar = inject(Snackbar);

  const id = route.paramMap.get('id');

  return store.select(favoritesFeature.selectStatus).pipe(
    filter((status) => status === 'loaded' || typeof status === 'object'),
    take(1),
    withLatestFrom(store.select(favoritesFeature.selectEntities)),
    map(([, entities]) => {
      if (id && id in entities) {
        return true;
      }

      snackbar.open('Photo not found', 'warn');
      return router.parseUrl('/favorites');
    }),
  );
};
