import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { vi } from 'vitest';

import { Photo } from '@shared/models/photo';

import { FavoritesActions } from '../favorites/store/favorites.actions';
import { PhotoDetail } from './photo-detail';

describe('PhotoDetail', () => {
  let fixture: ComponentFixture<PhotoDetail>;
  let navigate: ReturnType<typeof vi.fn>;

  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  function setup(entities: Record<string, Photo>, id = photo.id): void {
    navigate = vi.fn();

    TestBed.configureTestingModule({
      imports: [PhotoDetail],
      providers: [
        provideMockStore({ initialState: { favorites: { entities } } }),
        { provide: Router, useValue: { navigate } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id }) } },
        },
      ],
    });

    fixture = TestBed.createComponent(PhotoDetail);
  }

  it('renders the photo image when it exists in favorites', async () => {
    setup({ [photo.id]: photo });
    await fixture.whenStable();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe(photo.url);
  });

  it('renders nothing when the photo is not in favorites', async () => {
    setup({}, 'missing-id');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('dispatches removeFavorite and navigates to /favorites when remove is clicked', async () => {
    setup({ [photo.id]: photo });
    await fixture.whenStable();

    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(FavoritesActions.removeFavorite({ id: photo.id }));
    expect(navigate).toHaveBeenCalledWith(['/favorites']);
  });
});
