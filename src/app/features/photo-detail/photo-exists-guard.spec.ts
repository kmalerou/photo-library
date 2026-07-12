import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree, convertToParamMap } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { Snackbar } from '@core/snackbar';
import { Photo } from '@shared/models/photo';

import { FavoritesStatus } from '../favorites/store/favorites.reducer';
import { photoExistsGuard } from './photo-exists-guard';

describe('photoExistsGuard', () => {
  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  let parseUrl: ReturnType<typeof vi.fn>;
  let snackbarOpen: ReturnType<typeof vi.fn>;
  let store: MockStore;

  function setup(entities: Record<string, Photo>, status: FavoritesStatus = 'loaded'): void {
    parseUrl = vi.fn().mockReturnValue('parsed-url-tree');
    snackbarOpen = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { favorites: { entities, status } } }),
        { provide: Router, useValue: { parseUrl } },
        { provide: Snackbar, useValue: { open: snackbarOpen } },
      ],
    });

    store = TestBed.inject(MockStore);
  }

  function runGuard(id: string): Observable<boolean | UrlTree> {
    const route = { paramMap: convertToParamMap({ id }) } as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => photoExistsGuard(route, {} as never)) as Observable<
      boolean | UrlTree
    >;
  }

  it('allows activation when the photo is in favorites', async () => {
    setup({ [photo.id]: photo });

    const result = await firstValueFrom(runGuard(photo.id));

    expect(result).toBe(true);
    expect(snackbarOpen).not.toHaveBeenCalled();
  });

  it('redirects to /favorites and shows a toast when the photo is not favorited', async () => {
    setup({});

    const result = await firstValueFrom(runGuard('missing-id'));

    expect(result).toBe('parsed-url-tree');
    expect(parseUrl).toHaveBeenCalledWith('/favorites');
    expect(snackbarOpen).toHaveBeenCalledWith('Photo not found', 'warn');
  });

  it('redirects and shows the toast even when favorites failed to load', async () => {
    setup({}, { error: { operation: 'load', message: 'Storage unavailable' } });

    const result = await firstValueFrom(runGuard(photo.id));

    expect(result).toBe('parsed-url-tree');
    expect(snackbarOpen).toHaveBeenCalledWith('Photo not found', 'warn');
  });

  it('waits for favorites to finish loading before deciding', () => {
    setup({}, 'idle');

    const emissions: unknown[] = [];
    const subscription = runGuard(photo.id).subscribe((result) => emissions.push(result));

    expect(emissions).toHaveLength(0);

    store.setState({ favorites: { entities: { [photo.id]: photo }, status: 'loaded' } });

    expect(emissions).toEqual([true]);
    subscription.unsubscribe();
  });
});
