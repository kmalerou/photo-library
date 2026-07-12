import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { vi } from 'vitest';

import { Photo } from '@shared/models/photo';

import { Favorites } from './favorites';
import { FavoritesState } from './store/favorites.reducer';

describe('Favorites', () => {
  let fixture: ComponentFixture<Favorites>;
  let navigate: ReturnType<typeof vi.fn>;

  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  function setup(favorites: FavoritesState): void {
    navigate = vi.fn();

    TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        provideMockStore({ initialState: { favorites } }),
        { provide: Router, useValue: { navigate } },
      ],
    });

    fixture = TestBed.createComponent(Favorites);
  }

  it('renders an empty state when there are no favorites', async () => {
    setup({ entities: {}, status: 'idle' });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('navigates to / when browse photos is clicked from the empty state', async () => {
    setup({ entities: {}, status: 'idle' });
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('renders the photo grid when favorites are present', async () => {
    setup({ entities: { [photo.id]: photo }, status: 'loaded' });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-photo-grid')).toBeTruthy();
  });

  it('navigates to the detail page when a favorite photo is clicked', async () => {
    setup({ entities: { [photo.id]: photo }, status: 'loaded' });
    await fixture.whenStable();

    fixture.nativeElement.querySelector('mat-card').click();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/photos', photo.id]);
  });
});
