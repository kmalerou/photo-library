import { Component, OnDestroy, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Photo } from '@shared/models/photo';
import { ErrorState } from '@shared/ui/error-state/error-state';
import { Grid } from '@shared/ui/grid/grid';
import { InfiniteScroll } from '@shared/ui/infinite-scroll';
import { PhotoGrid } from '@shared/ui/photos/photo-grid/photo-grid';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { Spinner } from '@shared/ui/spinner/spinner';

import { FavoritesActions } from '../favorites/store/favorites.actions';
import { PhotoStreamActions } from './store/photo-stream.actions';
import { photoStreamFeature } from './store/photo-stream.reducer';

const SKELETON_COUNT = 8;

@Component({
  selector: 'app-photo-stream',
  imports: [PhotoGrid, Grid, Skeleton, Spinner, ErrorState, InfiniteScroll],
  templateUrl: './photo-stream.html',
  styleUrl: './photo-stream.scss',
})
export class PhotoStream implements OnDestroy {
  private readonly store = inject(Store);

  protected readonly photos = this.store.selectSignal(photoStreamFeature.selectPhotos);
  protected readonly status = this.store.selectSignal(photoStreamFeature.selectStatus);
  protected readonly hasMore = this.store.selectSignal(photoStreamFeature.selectHasMore);
  protected readonly isLoading = computed(() => this.status() === 'loading');
  protected readonly error = computed(() => {
    const status = this.status();
    return typeof status === 'object' ? status.error : null;
  });
  protected readonly skeletonPlaceholders = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

  constructor() {
    this.loadPhotos();
  }

  ngOnDestroy(): void {
    this.store.dispatch(PhotoStreamActions.reset());
  }

  protected loadMore(): void {
    this.loadPhotos();
  }

  protected retry(): void {
    this.loadPhotos();
  }

  protected addToFavorites(photo: Photo): void {
    this.store.dispatch(FavoritesActions.addFavorite({ photo }));
  }

  private loadPhotos(): void {
    this.store.dispatch(PhotoStreamActions.loadPhotos());
  }
}
