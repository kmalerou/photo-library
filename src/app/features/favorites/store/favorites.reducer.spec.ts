import { Action } from '@ngrx/store';
import { vi } from 'vitest';

import { Photo } from '@shared/models/photo';

import { FavoritesActions } from './favorites.actions';
import { favoritesFeature, loadInitialState } from './favorites.reducer';

describe('favoritesFeature reducer', () => {
  const noop: Action = { type: 'NOOP' };

  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  it('adds a photo on addFavoriteSuccess', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);

    const state = favoritesFeature.reducer(
      initialState,
      FavoritesActions.addFavoriteSuccess({ photo }),
    );

    expect(state.entities).toEqual({ [photo.id]: photo });
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

  it('falls back to empty entities when localStorage holds invalid JSON', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('not-json');

    expect(loadInitialState()).toEqual({ entities: {} });

    getItem.mockRestore();
  });

  it('removes a photo on removeFavorite', () => {
    const initialState = favoritesFeature.reducer(undefined, noop);
    const withOnePhoto = favoritesFeature.reducer(
      initialState,
      FavoritesActions.addFavoriteSuccess({ photo }),
    );

    const state = favoritesFeature.reducer(
      withOnePhoto,
      FavoritesActions.removeFavorite({ id: photo.id }),
    );

    expect(state.entities).toEqual({});
  });
});
