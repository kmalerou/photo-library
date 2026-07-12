import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

import { ApiError } from '@core/api';

import { PhotoApi } from '../photo-api';
import { PicsumPages } from '../picsum-pages';
import { PhotoStreamActions } from './photo-stream.actions';

export const loadPhotos$ = createEffect(
  (actions$ = inject(Actions), photoApi = inject(PhotoApi)) =>
    actions$.pipe(
      ofType(PhotoStreamActions.loadPhotos),
      exhaustMap(() =>
        photoApi.getPhotos().pipe(
          map(({ photos, hasMore }) => PhotoStreamActions.loadPhotosSuccess({ photos, hasMore })),
          catchError((error: ApiError) =>
            of(PhotoStreamActions.loadPhotosFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const resetPicsumPages$ = createEffect(
  (actions$ = inject(Actions), picsumPages = inject(PicsumPages)) =>
    actions$.pipe(
      ofType(PhotoStreamActions.reset),
      tap(() => picsumPages.reset()),
    ),
  { functional: true, dispatch: false },
);

export const photoStreamEffects = { loadPhotos$, resetPicsumPages$ };
