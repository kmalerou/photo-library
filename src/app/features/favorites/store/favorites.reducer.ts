import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Photo } from '@shared/models/photo';

import { FavoritesActions } from './favorites.actions';

export const FAVORITES_STORAGE_KEY = 'favorites';

export interface FavoritesState {
  readonly entities: Record<string, Photo>;
}

export function loadInitialState(): FavoritesState {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return { entities: raw ? JSON.parse(raw) : {} };
  } catch {
    return { entities: {} };
  }
}

export const favoritesFeature = createFeature({
  name: 'favorites',
  reducer: createReducer(
    loadInitialState(),
    on(
      FavoritesActions.addFavoriteSuccess,
      (state, { photo }): FavoritesState => ({
        entities: { ...state.entities, [photo.id]: photo },
      }),
    ),
    on(
      FavoritesActions.removeFavorite,
      (state, { id }): FavoritesState => {
        const { [id]: _removed, ...rest } = state.entities;
        return { entities: rest };
      },
    ),
  ),
  extraSelectors: ({ selectEntities }) => ({
    selectAll: createSelector(selectEntities, (entities) => Object.values(entities)),
  }),
});
