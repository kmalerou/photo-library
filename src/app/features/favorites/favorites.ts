import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Photo } from '@shared/models/photo';
import { EmptyState } from '@shared/ui/empty-state/empty-state';
import { PhotoGrid } from '@shared/ui/photos/photo-grid/photo-grid';

import { favoritesFeature } from './store/favorites.reducer';

@Component({
  selector: 'app-favorites',
  imports: [PhotoGrid, EmptyState],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly favorites = this.store.selectSignal(favoritesFeature.selectAll);

  protected viewPhoto(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }

  protected browsePhotos(): void {
    this.router.navigate(['/']);
  }
}
