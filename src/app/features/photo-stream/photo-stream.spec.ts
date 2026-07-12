import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { vi } from 'vitest';

import { Photo } from '@shared/models/photo';

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
    setup({ photos: [], page: 1, loading: false, error: null });
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(PhotoStreamActions.loadPhotos());
  });

  it('renders a skeleton grid on initial load', async () => {
    setup({ photos: [], page: 1, loading: true, error: null });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });

  it('renders an error state when the initial load fails', async () => {
    setup({ photos: [], page: 1, loading: false, error: 'Failed to load photos.' });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();
  });

  it('renders the photo grid when photos are present', async () => {
    setup({ photos: [photo], page: 2, loading: false, error: null });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-photo-grid')).toBeTruthy();
  });

  it('shows a spinner below the grid while loading more photos', async () => {
    setup({ photos: [photo], page: 2, loading: true, error: null });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-spinner')).toBeTruthy();
  });

  it('dispatches loadPhotos again when retry is clicked after a failed load', async () => {
    setup({ photos: [], page: 1, loading: false, error: 'Failed to load photos.' });
    await fixture.whenStable();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(PhotoStreamActions.loadPhotos());
  });
});
