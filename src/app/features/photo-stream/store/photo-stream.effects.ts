import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';

import { ApiError } from '@core/api';

import { PhotoApi } from '../photo-api';
import { PhotoStreamActions } from './photo-stream.actions';
import { photoStreamFeature } from './photo-stream.reducer';

export const loadPhotos$ = createEffect(
  (actions$ = inject(Actions), photoApi = inject(PhotoApi), store = inject(Store)) =>
    actions$.pipe(
      ofType(PhotoStreamActions.loadPhotos),
      withLatestFrom(store.select(photoStreamFeature.selectPage)),
      exhaustMap(([, page]) =>
        photoApi.getPhotos(page).pipe(
          map((photos) => PhotoStreamActions.loadPhotosSuccess({ photos })),
          catchError((error: ApiError) =>
            of(PhotoStreamActions.loadPhotosFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);
