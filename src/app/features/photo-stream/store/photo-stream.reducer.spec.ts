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

    expect(state).toEqual({ photos: [], status: 'idle', hasMore: null });
  });

  it('sets status to loading on loadPhotos', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, status: { error: 'previous error' } },
      PhotoStreamActions.loadPhotos(),
    );

    expect(state.status).toBe('loading');
  });

  it('appends photos, sets status to loaded, and records hasMore on loadPhotosSuccess', () => {
    const initialState = photoStreamFeature.reducer(undefined, noop);

    const state = photoStreamFeature.reducer(
      { ...initialState, status: 'loading' },
      PhotoStreamActions.loadPhotosSuccess({ photos: [photo], hasMore: true }),
    );

    expect(state.photos).toEqual([photo]);
    expect(state.status).toBe('loaded');
    expect(state.hasMore).toBe(true);
  });

  it('accumulates photos across multiple loads rather than replacing them', () => {
    let state = photoStreamFeature.reducer(undefined, noop);
    state = photoStreamFeature.reducer(
      state,
      PhotoStreamActions.loadPhotosSuccess({ photos: [photo], hasMore: true }),
    );
    state = photoStreamFeature.reducer(
      state,
      PhotoStreamActions.loadPhotosSuccess({ photos: [{ ...photo, id: '2' }], hasMore: false }),
    );

    expect(state.photos.map((p) => p.id)).toEqual(['1', '2']);
    expect(state.hasMore).toBe(false);
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
      PhotoStreamActions.loadPhotosSuccess({ photos: [photo], hasMore: true }),
    );

    const state = photoStreamFeature.reducer(withPhotos, PhotoStreamActions.reset());

    expect(state).toEqual(initialState);
  });
});
