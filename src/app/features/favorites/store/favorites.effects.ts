import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs';

import { Snackbar } from '@core/snackbar';
import { Photo } from '@shared/models/photo';

import { FavoritesActions } from './favorites.actions';
import { FAVORITES_STORAGE_KEY, favoritesFeature } from './favorites.reducer';

export const addFavorite$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), snackbar = inject(Snackbar)) =>
    actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      withLatestFrom(store.select(favoritesFeature.selectEntities)),
      map(([{ photo }, entities]) => {
        if (photo.id in entities) {
          snackbar.open('Already in favorites', 'warn');
          return FavoritesActions.addFavoriteDuplicate();
        }

        persistFavorites({ ...entities, [photo.id]: photo });
        snackbar.open('Added to favorites', 'success');
        return FavoritesActions.addFavoriteSuccess({ photo });
      }),
    ),
  { functional: true },
);

export const removeFavorite$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), snackbar = inject(Snackbar)) =>
    actions$.pipe(
      ofType(FavoritesActions.removeFavorite),
      withLatestFrom(store.select(favoritesFeature.selectEntities)),
      tap(([{ id }, entities]) => {
        const { [id]: _removed, ...rest } = entities;
        persistFavorites(rest);
        snackbar.open('Removed from favorites', 'success');
      }),
    ),
  { functional: true, dispatch: false },
);

function persistFavorites(entities: Record<string, Photo>): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(entities));
}
