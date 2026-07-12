import { inject } from '@angular/core';
import { Actions, createEffect, ofType, rootEffectsInit } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs';

import { LocalStorage } from '@core/local-storage';
import { Snackbar, SnackbarType } from '@core/snackbar';
import { Photo } from '@shared/models/photo';
import { toErrorMessage } from '@shared/utils/error';

import { FavoritesActions } from './favorites.actions';
import { FAVORITES_STORAGE_KEY, favoritesFeature } from './favorites.reducer';

const FAVORITES_TOASTS: Record<string, { message: string; type: SnackbarType }> = {
  [FavoritesActions.loadFavoritesFailure.type]: {
    message: 'Could not load your favorites',
    type: 'warn',
  },
  [FavoritesActions.addFavoriteSuccess.type]: { message: 'Added to favorites', type: 'success' },
  [FavoritesActions.addFavoriteDuplicate.type]: {
    message: 'Already in favorites',
    type: 'warn',
  },
  [FavoritesActions.addFavoriteFailure.type]: {
    message: 'Could not save your favorite',
    type: 'warn',
  },
  [FavoritesActions.removeFavoriteSuccess.type]: {
    message: 'Removed from favorites',
    type: 'success',
  },
  [FavoritesActions.removeFavoriteFailure.type]: {
    message: 'Could not remove your favorite',
    type: 'warn',
  },
};

function showFavoritesToast(action: Action, snackbar: Snackbar): void {
  const toast = FAVORITES_TOASTS[action.type];
  snackbar.open(toast.message, toast.type);
}

export const loadFavorites$ = createEffect(
  (actions$ = inject(Actions), storage = inject(LocalStorage)) =>
    actions$.pipe(
      ofType(FavoritesActions.loadFavorites, rootEffectsInit),
      map(() => {
        try {
          const entities = storage.getItem<Record<string, Photo>>(FAVORITES_STORAGE_KEY) ?? {};
          return FavoritesActions.loadFavoritesSuccess({ entities });
        } catch (error) {
          return FavoritesActions.loadFavoritesFailure({ error: toErrorMessage(error) });
        }
      }),
    ),
  { functional: true },
);

export const addFavorite$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), storage = inject(LocalStorage)) =>
    actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      withLatestFrom(store.select(favoritesFeature.selectEntities)),
      map(([{ photo }, entities]) => {
        if (photo.id in entities) {
          return FavoritesActions.addFavoriteDuplicate();
        }

        try {
          storage.setItem(FAVORITES_STORAGE_KEY, { ...entities, [photo.id]: photo });
          return FavoritesActions.addFavoriteSuccess({ photo });
        } catch (error) {
          return FavoritesActions.addFavoriteFailure({ error: toErrorMessage(error) });
        }
      }),
    ),
  { functional: true },
);

export const removeFavorite$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), storage = inject(LocalStorage)) =>
    actions$.pipe(
      ofType(FavoritesActions.removeFavorite),
      withLatestFrom(store.select(favoritesFeature.selectEntities)),
      map(([{ id }, entities]) => {
        const { [id]: _removed, ...rest } = entities;

        try {
          storage.setItem(FAVORITES_STORAGE_KEY, rest);
          return FavoritesActions.removeFavoriteSuccess({ id });
        } catch (error) {
          return FavoritesActions.removeFavoriteFailure({ error: toErrorMessage(error) });
        }
      }),
    ),
  { functional: true },
);

export const notifyFavorites$ = createEffect(
  (actions$ = inject(Actions), snackbar = inject(Snackbar)) =>
    actions$.pipe(
      ofType(
        FavoritesActions.loadFavoritesFailure,
        FavoritesActions.addFavoriteSuccess,
        FavoritesActions.addFavoriteDuplicate,
        FavoritesActions.addFavoriteFailure,
        FavoritesActions.removeFavoriteSuccess,
        FavoritesActions.removeFavoriteFailure,
      ),
      tap((action) => showFavoritesToast(action, snackbar)),
    ),
  { functional: true, dispatch: false },
);

export const favoritesEffects = { loadFavorites$, addFavorite$, removeFavorite$, notifyFavorites$ };
