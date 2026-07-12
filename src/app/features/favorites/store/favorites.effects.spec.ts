import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Subject, firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';

import { Snackbar } from '@core/snackbar';
import { Photo } from '@shared/models/photo';

import { FavoritesActions } from './favorites.actions';
import { addFavorite$, removeFavorite$ } from './favorites.effects';

describe('favorites effects', () => {
  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  let actions$: Subject<Action>;
  let snackbarOpen: ReturnType<typeof vi.fn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  function setup(entities: Record<string, Photo>): void {
    actions$ = new Subject<Action>();
    snackbarOpen = vi.fn();
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: Snackbar, useValue: { open: snackbarOpen } },
        { provide: Store, useValue: { select: () => of(entities) } },
      ],
    });
  }

  afterEach(() => {
    setItemSpy.mockRestore();
  });

  describe('addFavorite$', () => {
    it('dispatches addFavoriteSuccess, persists, and shows a success toast for a new favorite', async () => {
      setup({});

      const result = firstValueFrom(TestBed.runInInjectionContext(() => addFavorite$()));
      actions$.next(FavoritesActions.addFavorite({ photo }));

      expect(await result).toEqual(FavoritesActions.addFavoriteSuccess({ photo }));
      expect(snackbarOpen).toHaveBeenCalledWith('Added to favorites', 'success');
      expect(setItemSpy).toHaveBeenCalledWith(
        'favorites',
        JSON.stringify({ [photo.id]: photo }),
      );
    });

    it('dispatches addFavoriteDuplicate and shows a warn toast for an existing favorite', async () => {
      setup({ [photo.id]: photo });

      const result = firstValueFrom(TestBed.runInInjectionContext(() => addFavorite$()));
      actions$.next(FavoritesActions.addFavorite({ photo }));

      expect(await result).toEqual(FavoritesActions.addFavoriteDuplicate());
      expect(snackbarOpen).toHaveBeenCalledWith('Already in favorites', 'warn');
      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeFavorite$', () => {
    it('persists the entities without the removed photo and shows a success toast', async () => {
      setup({ [photo.id]: photo });

      const result = firstValueFrom(TestBed.runInInjectionContext(() => removeFavorite$()));
      actions$.next(FavoritesActions.removeFavorite({ id: photo.id }));
      await result;

      expect(snackbarOpen).toHaveBeenCalledWith('Removed from favorites', 'success');
      expect(setItemSpy).toHaveBeenCalledWith('favorites', JSON.stringify({}));
    });
  });
});
