import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { ErrorState } from '@shared/ui/error-state/error-state';
import { Grid } from '@shared/ui/grid/grid';
import { InfiniteScroll } from '@shared/ui/infinite-scroll';
import { PhotoGrid } from '@shared/ui/photos/photo-grid/photo-grid';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { Spinner } from '@shared/ui/spinner/spinner';

import { PhotoStreamActions } from './store/photo-stream.actions';
import { photoStreamFeature } from './store/photo-stream.reducer';

const SKELETON_COUNT = 8;

@Component({
  selector: 'app-photo-stream',
  imports: [PhotoGrid, Grid, Skeleton, Spinner, ErrorState, InfiniteScroll],
  templateUrl: './photo-stream.html',
  styleUrl: './photo-stream.scss',
})
export class PhotoStream {
  private readonly store = inject(Store);

  protected readonly photos = this.store.selectSignal(photoStreamFeature.selectPhotos);
  protected readonly loading = this.store.selectSignal(photoStreamFeature.selectLoading);
  protected readonly error = this.store.selectSignal(photoStreamFeature.selectError);
  protected readonly skeletonPlaceholders = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

  constructor() {
    this.loadPhotos();
  }

  protected onScrolled(): void {
    this.loadPhotos();
  }

  protected retry(): void {
    this.loadPhotos();
  }

  private loadPhotos(): void {
    this.store.dispatch(PhotoStreamActions.loadPhotos());
  }
}
