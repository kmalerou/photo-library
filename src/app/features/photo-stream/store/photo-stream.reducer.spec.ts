import { Action } from '@ngrx/store';

import { Photo } from '@shared/models/photo';

import { PhotoStreamActions } from './photo-stream.actions';
import { photoStreamFeature } from './photo-stream.reducer';

describe('photoStreamFeature reducer', () => {
  const noop: Action = { type: 'NOOP' };

  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  it('sets loading and clears any previous error on loadPhotos', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, error: 'previous error' },
      PhotoStreamActions.loadPhotos(),
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('appends photos and increments the page on loadPhotosSuccess', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, loading: true },
      PhotoStreamActions.loadPhotosSuccess({ photos: [photo] }),
    );

    expect(state.photos).toEqual([photo]);
    expect(state.page).toBe(2);
    expect(state.loading).toBe(false);
  });

  it('accumulates photos across multiple pages rather than replacing them', () => {
    let state = photoStreamFeature.reducer(undefined, noop);
    state = photoStreamFeature.reducer(
      state,
      PhotoStreamActions.loadPhotosSuccess({ photos: [photo] }),
    );
    state = photoStreamFeature.reducer(
      state,
      PhotoStreamActions.loadPhotosSuccess({ photos: [{ ...photo, id: '2' }] }),
    );

    expect(state.photos.map((p) => p.id)).toEqual(['1', '2']);
    expect(state.page).toBe(3);
  });

  it('sets the error and clears loading on loadPhotosFailure', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, loading: true },
      PhotoStreamActions.loadPhotosFailure({ error: 'Failed to load photos.' }),
    );

    expect(state.error).toBe('Failed to load photos.');
    expect(state.loading).toBe(false);
  });
});
