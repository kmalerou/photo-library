import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { rootEffectsInit } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject, firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { LocalStorage } from '@core/local-storage';
import { Snackbar } from '@core/snackbar';
import { Photo } from '@shared/models/photo';

import { FavoritesActions } from './favorites.actions';
import {
  addFavorite$,
  loadFavorites$,
  notifyFavorites$,
  removeFavorite$,
} from './favorites.effects';

describe('favorites effects', () => {
  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  let actions$: Subject<Action>;
  let getItem: ReturnType<typeof vi.fn>;
  let setItem: ReturnType<typeof vi.fn>;
  let snackbarOpen: ReturnType<typeof vi.fn>;

  function setup(entities: Record<string, Photo> = {}): void {
    actions$ = new Subject<Action>();
    getItem = vi.fn();
    setItem = vi.fn();
    snackbarOpen = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: { favorites: { entities, status: 'loaded' } },
        }),
        { provide: LocalStorage, useValue: { getItem, setItem } },
        { provide: Snackbar, useValue: { open: snackbarOpen } },
      ],
    });
  }

  describe('loadFavorites$', () => {
    it('dispatches loadFavoritesSuccess with the stored entities on loadFavorites', async () => {
      setup();
      getItem.mockReturnValue({ [photo.id]: photo });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => loadFavorites$()),
      );
      actions$.next(FavoritesActions.loadFavorites());

      expect(await result).toEqual(
        FavoritesActions.loadFavoritesSuccess({
          entities: { [photo.id]: photo },
        }),
      );
    });

    it('dispatches loadFavoritesSuccess on the root effects init action', async () => {
      setup();
      getItem.mockReturnValue({ [photo.id]: photo });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => loadFavorites$()),
      );
      actions$.next(rootEffectsInit());

      expect(await result).toEqual(
        FavoritesActions.loadFavoritesSuccess({
          entities: { [photo.id]: photo },
        }),
      );
    });

    it('defaults to an empty entities map when nothing is stored', async () => {
      setup();
      getItem.mockReturnValue(null);

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => loadFavorites$()),
      );
      actions$.next(FavoritesActions.loadFavorites());

      expect(await result).toEqual(
        FavoritesActions.loadFavoritesSuccess({ entities: {} }),
      );
    });

    it('dispatches loadFavoritesFailure when reading storage throws', async () => {
      setup();
      getItem.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => loadFavorites$()),
      );
      actions$.next(FavoritesActions.loadFavorites());

      expect(await result).toEqual(
        FavoritesActions.loadFavoritesFailure({ error: 'Storage unavailable' }),
      );
    });

    it('falls back to a generic message when a non-Error value is thrown', async () => {
      setup();
      getItem.mockImplementation(() => {
        throw 'boom';
      });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => loadFavorites$()),
      );
      actions$.next(FavoritesActions.loadFavorites());

      expect(await result).toEqual(
        FavoritesActions.loadFavoritesFailure({
          error: 'Something went wrong.',
        }),
      );
    });
  });

  describe('addFavorite$', () => {
    it('dispatches addFavoriteSuccess and persists a new favorite', async () => {
      setup({});

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => addFavorite$()),
      );
      actions$.next(FavoritesActions.addFavorite({ photo }));

      expect(await result).toEqual(
        FavoritesActions.addFavoriteSuccess({ photo }),
      );
      expect(setItem).toHaveBeenCalledWith('favorites', { [photo.id]: photo });
    });

    it('dispatches addFavoriteDuplicate without persisting for an existing favorite', async () => {
      setup({ [photo.id]: photo });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => addFavorite$()),
      );
      actions$.next(FavoritesActions.addFavorite({ photo }));

      expect(await result).toEqual(FavoritesActions.addFavoriteDuplicate());
      expect(setItem).not.toHaveBeenCalled();
    });

    it('dispatches addFavoriteFailure when persisting throws', async () => {
      setup({});
      setItem.mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => addFavorite$()),
      );
      actions$.next(FavoritesActions.addFavorite({ photo }));

      expect(await result).toEqual(
        FavoritesActions.addFavoriteFailure({ error: 'Quota exceeded' }),
      );
    });
  });

  describe('removeFavorite$', () => {
    it('dispatches removeFavoriteSuccess and persists the entities without the removed photo', async () => {
      setup({ [photo.id]: photo });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => removeFavorite$()),
      );
      actions$.next(FavoritesActions.removeFavorite({ id: photo.id }));

      expect(await result).toEqual(
        FavoritesActions.removeFavoriteSuccess({ id: photo.id }),
      );
      expect(setItem).toHaveBeenCalledWith('favorites', {});
    });

    it('dispatches removeFavoriteFailure when persisting throws', async () => {
      setup({ [photo.id]: photo });
      setItem.mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      const result = firstValueFrom(
        TestBed.runInInjectionContext(() => removeFavorite$()),
      );
      actions$.next(FavoritesActions.removeFavorite({ id: photo.id }));

      expect(await result).toEqual(
        FavoritesActions.removeFavoriteFailure({ error: 'Quota exceeded' }),
      );
    });
  });

  describe('notifyFavorites$', () => {
    it.each([
      [
        FavoritesActions.loadFavoritesFailure({ error: 'x' }),
        'Could not load your favorites',
        'warn',
      ],
      [
        FavoritesActions.addFavoriteSuccess({ photo }),
        'Added to favorites',
        'success',
      ],
      [FavoritesActions.addFavoriteDuplicate(), 'Already in favorites', 'warn'],
      [
        FavoritesActions.addFavoriteFailure({ error: 'x' }),
        'Could not save your favorite',
        'warn',
      ],
      [
        FavoritesActions.removeFavoriteSuccess({ id: photo.id }),
        'Removed from favorites',
        'success',
      ],
      [
        FavoritesActions.removeFavoriteFailure({ error: 'x' }),
        'Could not remove your favorite',
        'warn',
      ],
    ] as const)(
      'shows the right toast for %s',
      async (action, message, type) => {
        setup();

        const emitted = firstValueFrom(
          TestBed.runInInjectionContext(() => notifyFavorites$()),
        );
        actions$.next(action);
        await emitted;

        expect(snackbarOpen).toHaveBeenCalledWith(message, type);
      },
    );
  });
});
