import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { vi } from 'vitest';

import { Snackbar } from '@core/snackbar';
import { Photo } from '@shared/models/photo';

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

  function setup(entities: Record<string, Photo>): void {
    parseUrl = vi.fn().mockReturnValue('parsed-url-tree');
    snackbarOpen = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { favorites: { entities } } }),
        { provide: Router, useValue: { parseUrl } },
        { provide: Snackbar, useValue: { open: snackbarOpen } },
      ],
    });
  }

  function runGuard(id: string) {
    const route = { paramMap: convertToParamMap({ id }) } as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => photoExistsGuard(route, {} as never));
  }

  it('allows activation when the photo is in favorites', () => {
    setup({ [photo.id]: photo });

    const result = runGuard(photo.id);

    expect(result).toBe(true);
    expect(snackbarOpen).not.toHaveBeenCalled();
  });

  it('redirects to /favorites and shows a toast when the photo is not favorited', () => {
    setup({});

    const result = runGuard('missing-id');

    expect(result).toBe('parsed-url-tree');
    expect(parseUrl).toHaveBeenCalledWith('/favorites');
    expect(snackbarOpen).toHaveBeenCalledWith('Photo not found', 'warn');
  });
});
