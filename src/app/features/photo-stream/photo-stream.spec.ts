import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { vi } from 'vitest';

import { Photo } from '@shared/models/photo';
import { InfiniteScroll } from '@shared/ui/infinite-scroll';

import { FavoritesActions } from '../favorites/store/favorites.actions';
import { PhotoStream } from './photo-stream';
import { PhotoStreamActions } from './store/photo-stream.actions';
import { PhotoStreamState } from './store/photo-stream.reducer';

describe('PhotoStream', () => {
  let fixture: ComponentFixture<PhotoStream>;
  let store: MockStore;

  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(function () {
        return { observe: vi.fn(), disconnect: vi.fn() };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function setup(photoStream: PhotoStreamState): void {
    TestBed.configureTestingModule({
      imports: [PhotoStream],
      providers: [provideMockStore({ initialState: { photoStream } })],
    });

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(PhotoStream);
  }

  it('dispatches loadPhotos on init', async () => {
    setup({ photos: [], status: 'idle', hasMore: null });
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(PhotoStreamActions.loadPhotos());
  });

  it('renders a skeleton grid on initial load', async () => {
    setup({ photos: [], status: 'loading', hasMore: null });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });

  it('renders an error state when the initial load fails', async () => {
    setup({ photos: [], status: { error: 'Failed to load photos.' }, hasMore: null });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();
  });

  it('renders the photo grid when photos are present', async () => {
    setup({ photos: [photo], status: 'loaded', hasMore: true });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-photo-grid')).toBeTruthy();
  });

  it('shows a spinner below the grid while loading more photos', async () => {
    setup({ photos: [photo], status: 'loading', hasMore: true });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-spinner')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('mat-progress-spinner')?.getAttribute('aria-label'),
    ).toBe('Loading more photos');
  });

  it('dispatches loadPhotos again when retry is clicked after a failed load', async () => {
    setup({ photos: [], status: { error: 'Failed to load photos.' }, hasMore: null });
    await fixture.whenStable();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(PhotoStreamActions.loadPhotos());
  });

  it('dispatches addFavorite when a photo card is clicked', async () => {
    setup({ photos: [photo], status: 'loaded', hasMore: true });
    await fixture.whenStable();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    fixture.nativeElement.querySelector('mat-card').click();
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(FavoritesActions.addFavorite({ photo }));
  });

  it('dispatches loadPhotos when the scroll sentinel reports scrolled', async () => {
    setup({ photos: [photo], status: 'loaded', hasMore: true });
    await fixture.whenStable();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    const sentinel = fixture.debugElement.query(By.directive(InfiniteScroll));
    sentinel.injector.get(InfiniteScroll).scrolled.emit();
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(PhotoStreamActions.loadPhotos());
  });

  it('disables the infinite scroll sentinel once there are no more photos to load', async () => {
    setup({ photos: [photo], status: 'loaded', hasMore: false });
    await fixture.whenStable();

    const sentinel = fixture.debugElement.query(By.directive(InfiniteScroll));

    expect(sentinel.injector.get(InfiniteScroll).disabled()).toBe(true);
  });

  it('shows an end-of-content message once there are no more photos to load', async () => {
    setup({ photos: [photo], status: 'loaded', hasMore: false });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.end-message')?.textContent).toContain(
      "You've reached the end",
    );
  });

  it('does not show the end-of-content message while more photos are still loading', async () => {
    setup({ photos: [photo], status: 'loading', hasMore: false });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.end-message')).toBeNull();
  });

  it('dispatches reset on destroy', async () => {
    setup({ photos: [photo], status: 'loaded', hasMore: true });
    await fixture.whenStable();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(PhotoStreamActions.reset());
  });
});
