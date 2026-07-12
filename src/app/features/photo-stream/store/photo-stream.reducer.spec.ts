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

  it('starts idle with no photos', () => {
    const state = photoStreamFeature.reducer(undefined, noop);

    expect(state).toEqual({ photos: [], page: 1, status: 'idle' });
  });

  it('sets status to loading on loadPhotos', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, status: { error: 'previous error' } },
      PhotoStreamActions.loadPhotos(),
    );

    expect(state.status).toBe('loading');
  });

  it('appends photos, increments the page, and sets status to loaded on loadPhotosSuccess', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, status: 'loading' },
      PhotoStreamActions.loadPhotosSuccess({ photos: [photo] }),
    );

    expect(state.photos).toEqual([photo]);
    expect(state.page).toBe(2);
    expect(state.status).toBe('loaded');
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

  it('sets an error status on loadPhotosFailure', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, status: 'loading' },
      PhotoStreamActions.loadPhotosFailure({ error: 'Failed to load photos.' }),
    );

    expect(state.status).toEqual({ error: 'Failed to load photos.' });
  });

  it('returns to the initial state on reset', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);
    const withPhotos = photoStreamFeature.reducer(
      initialState,
      PhotoStreamActions.loadPhotosSuccess({ photos: [photo] }),
    );

    const state = photoStreamFeature.reducer(withPhotos, PhotoStreamActions.reset());

    expect(state).toEqual(initialState);
  });
});
