import { Action } from '@ngrx/store';

import { Photo } from '@shared/models/photo';

import { FavoritesActions } from './favorites.actions';
import { favoritesFeature } from './favorites.reducer';

describe('favoritesFeature reducer', () => {
  const noop: Action = { type: 'NOOP' };

  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  it('starts idle with no favorites', () => {
    const state = favoritesFeature.reducer(undefined, noop);

    expect(state).toEqual({ entities: {}, status: 'idle' });
  });

  it('sets status to loading on loadFavorites', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);

    const state = favoritesFeature.reducer(initialState, FavoritesActions.loadFavorites());

    expect(state.status).toBe('loading');
  });

  it('replaces entities and sets status to loaded on loadFavoritesSuccess', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);

    const state = favoritesFeature.reducer(
      initialState,
      FavoritesActions.loadFavoritesSuccess({ entities: { [photo.id]: photo } }),
    );

    expect(state).toEqual({ entities: { [photo.id]: photo }, status: 'loaded' });
  });

  it('sets an error status on loadFavoritesFailure', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);

    const state = favoritesFeature.reducer(
      initialState,
      FavoritesActions.loadFavoritesFailure({ error: 'Storage unavailable' }),
    );

    expect(state.status).toEqual({
      error: { operation: 'load', message: 'Storage unavailable' },
    });
  });

  it('adds a photo on addFavoriteSuccess', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);

    const state = favoritesFeature.reducer(
      initialState,
      FavoritesActions.addFavoriteSuccess({ photo }),
    );

    expect(state.entities).toEqual({ [photo.id]: photo });
    expect(state.status).toBe('loaded');
  });

  it('ignores addFavoriteDuplicate entirely', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);
    const withOnePhoto = favoritesFeature.reducer(
      initialState,
      FavoritesActions.addFavoriteSuccess({ photo }),
    );

    const state = favoritesFeature.reducer(
      withOnePhoto,
      FavoritesActions.addFavoriteDuplicate(),
    );

    expect(state).toBe(withOnePhoto);
  });

  it('sets an error status on addFavoriteFailure', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);

    const state = favoritesFeature.reducer(
      initialState,
      FavoritesActions.addFavoriteFailure({ error: 'Quota exceeded' }),
    );

    expect(state.status).toEqual({
      error: { operation: 'add', message: 'Quota exceeded' },
    });
  });

  it('removes a photo on removeFavoriteSuccess', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);
    const withOnePhoto = favoritesFeature.reducer(
      initialState,
      FavoritesActions.addFavoriteSuccess({ photo }),
    );

    const state = favoritesFeature.reducer(
      withOnePhoto,
      FavoritesActions.removeFavoriteSuccess({ id: photo.id }),
    );

    expect(state.entities).toEqual({});
    expect(state.status).toBe('loaded');
  });

  it('sets an error status on removeFavoriteFailure', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);

    const state = favoritesFeature.reducer(
      initialState,
      FavoritesActions.removeFavoriteFailure({ error: 'Quota exceeded' }),
    );

    expect(state.status).toEqual({
      error: { operation: 'remove', message: 'Quota exceeded' },
    });
  });

  describe('selectError', () => {
    it('returns null when status is not an error', () => {
      const state = favoritesFeature.reducer(undefined, noop);

      expect(favoritesFeature.selectError.projector(state.status)).toBeNull();
    });

    it('returns the error when status is an error', () => {
      const initialState = favoritesFeature.reducer(undefined, noop);
      const state = favoritesFeature.reducer(
        initialState,
        FavoritesActions.loadFavoritesFailure({ error: 'Storage unavailable' }),
      );

      expect(favoritesFeature.selectError.projector(state.status)).toEqual({
        operation: 'load',
        message: 'Storage unavailable',
      });
    });
  });
});
