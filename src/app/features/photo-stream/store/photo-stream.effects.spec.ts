import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Subject, firstValueFrom, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ApiError } from '@core/api';
import { Photo } from '@shared/models/photo';

import { PhotoApi } from '../photo-api';
import { PhotoStreamActions } from './photo-stream.actions';
import { loadPhotos$ } from './photo-stream.effects';

describe('loadPhotos$ effect', () => {
  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  let actions$: Subject<Action>;
  let getPhotos: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    actions$ = new Subject<Action>();
    getPhotos = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: PhotoApi, useValue: { getPhotos } },
        { provide: Store, useValue: { select: () => of(1) } },
      ],
    });
  });

  it('dispatches loadPhotosSuccess with the fetched photos', async () => {
    getPhotos.mockReturnValue(of([photo]));

    const result = firstValueFrom(TestBed.runInInjectionContext(() => loadPhotos$()));
    actions$.next(PhotoStreamActions.loadPhotos());

    expect(await result).toEqual(PhotoStreamActions.loadPhotosSuccess({ photos: [photo] }));
    expect(getPhotos).toHaveBeenCalledWith(1);
  });

  it('dispatches loadPhotosFailure when the API errors', async () => {
    const apiError: ApiError = { status: 500, message: 'Server error' };
    getPhotos.mockReturnValue(throwError(() => apiError));

    const result = firstValueFrom(TestBed.runInInjectionContext(() => loadPhotos$()));
    actions$.next(PhotoStreamActions.loadPhotos());

    expect(await result).toEqual(PhotoStreamActions.loadPhotosFailure({ error: 'Server error' }));
  });
});
