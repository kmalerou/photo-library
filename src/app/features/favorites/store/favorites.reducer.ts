import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { LoadStatus } from '@shared/models/load-status';
import { Photo } from '@shared/models/photo';

import { FavoritesActions } from './favorites.actions';

export const FAVORITES_STORAGE_KEY = 'favorites';

export interface FavoritesError {
  readonly operation: 'load' | 'add' | 'remove';
  readonly message: string;
}

export type FavoritesStatus = LoadStatus<FavoritesError>;

export interface FavoritesState {
  readonly entities: Record<string, Photo>;
  readonly status: FavoritesStatus;
}

const initialState: FavoritesState = { entities: {}, status: 'idle' };

export const favoritesFeature = createFeature({
  name: 'favorites',
  reducer: createReducer(
    initialState,
    on(FavoritesActions.loadFavorites, (state): FavoritesState => ({
      ...state,
      status: 'loading',
    })),
    on(
      FavoritesActions.loadFavoritesSuccess,
      (_state, { entities }): FavoritesState => ({
        entities,
        status: 'loaded',
      }),
    ),
    on(
      FavoritesActions.loadFavoritesFailure,
      (state, { error }): FavoritesState => ({
        ...state,
        status: { error: { operation: 'load', message: error } },
      }),
    ),
    on(
      FavoritesActions.addFavoriteSuccess,
      (state, { photo }): FavoritesState => ({
        entities: { ...state.entities, [photo.id]: photo },
        status: 'loaded',
      }),
    ),
    on(
      FavoritesActions.addFavoriteFailure,
      (state, { error }): FavoritesState => ({
        ...state,
        status: { error: { operation: 'add', message: error } },
      }),
    ),
    on(
      FavoritesActions.removeFavoriteSuccess,
      (state, { id }): FavoritesState => {
        const { [id]: _removed, ...rest } = state.entities;
        return { entities: rest, status: 'loaded' };
      },
    ),
    on(
      FavoritesActions.removeFavoriteFailure,
      (state, { error }): FavoritesState => ({
        ...state,
        status: { error: { operation: 'remove', message: error } },
      }),
    ),
  ),
  extraSelectors: ({ selectEntities, selectStatus }) => ({
    selectAll: createSelector(selectEntities, (entities) =>
      Object.values(entities),
    ),
    selectError: createSelector(selectStatus, (status) =>
      typeof status === 'object' ? status.error : null,
    ),
  }),
});
