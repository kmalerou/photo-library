import { createFeature, createReducer, on } from '@ngrx/store';

import { LoadStatus } from '@shared/models/load-status';
import { Photo } from '@shared/models/photo';

import { PhotoStreamActions } from './photo-stream.actions';

export type PhotoStreamStatus = LoadStatus<string>;

export interface PhotoStreamState {
  readonly photos: Photo[];
  readonly page: number;
  readonly status: PhotoStreamStatus;
}

const initialState: PhotoStreamState = {
  photos: [],
  page: 1,
  status: 'idle',
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
      (state, { photos }): PhotoStreamState => ({
        photos: [...state.photos, ...photos],
        page: state.page + 1,
        status: 'loaded',
      }),
    ),
    on(
      PhotoStreamActions.loadPhotosFailure,
      (state, { error }): PhotoStreamState => ({ ...state, status: { error } }),
    ),
    on(PhotoStreamActions.reset, (): PhotoStreamState => initialState),
  ),
});
