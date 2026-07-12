import { createFeature, createReducer, on } from '@ngrx/store';

import { LoadStatus } from '@shared/models/load-status';
import { Photo } from '@shared/models/photo';

import { PhotoStreamActions } from './photo-stream.actions';

export type PhotoStreamStatus = LoadStatus<string>;

export interface PhotoStreamState {
  readonly photos: Photo[];
  readonly status: PhotoStreamStatus;
  readonly hasMore: boolean | null;
}

const initialState: PhotoStreamState = {
  photos: [],
  status: 'idle',
  hasMore: null,
};

export const photoStreamFeature = createFeature({
  name: 'photoStream',
  reducer: createReducer(
    initialState,
    on(
      PhotoStreamActions.loadPhotos,
      (state): PhotoStreamState => ({ ...state, status: 'loading' }),
    ),
    on(
      PhotoStreamActions.loadPhotosSuccess,
      (state, { photos, hasMore }): PhotoStreamState => ({
        photos: [...state.photos, ...photos],
        status: 'loaded',
        hasMore,
      }),
    ),
    on(
      PhotoStreamActions.loadPhotosFailure,
      (state, { error }): PhotoStreamState => ({ ...state, status: { error } }),
    ),
    on(PhotoStreamActions.reset, (): PhotoStreamState => initialState),
  ),
});
