import { createFeature, createReducer, on } from '@ngrx/store';

import { Photo } from '@shared/models/photo';

import { PhotoStreamActions } from './photo-stream.actions';

export interface PhotoStreamState {
  readonly photos: Photo[];
  readonly page: number;
  readonly loading: boolean;
  readonly error: string | null;
}

const initialState: PhotoStreamState = {
  photos: [],
  page: 1,
  loading: false,
  error: null,
};

export const photoStreamFeature = createFeature({
  name: 'photoStream',
  reducer: createReducer(
    initialState,
    on(
      PhotoStreamActions.loadPhotos,
      (state): PhotoStreamState => ({
        ...state,
        loading: true,
        error: null,
      }),
    ),
    on(
      PhotoStreamActions.loadPhotosSuccess,
      (state, { photos }): PhotoStreamState => ({
        ...state,
        photos: [...state.photos, ...photos],
        page: state.page + 1,
        loading: false,
      }),
    ),
    on(
      PhotoStreamActions.loadPhotosFailure,
      (state, { error }): PhotoStreamState => ({
        ...state,
        loading: false,
        error,
      }),
    ),
  ),
});
