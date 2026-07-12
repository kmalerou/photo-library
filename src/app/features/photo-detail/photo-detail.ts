import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Button } from '@shared/ui/button/button';
import { Card } from '@shared/ui/card/card';
import { ImageFallback } from '@shared/ui/image-fallback';

import { FavoritesActions } from '../favorites/store/favorites.actions';
import { favoritesFeature } from '../favorites/store/favorites.reducer';

@Component({
  selector: 'app-photo-detail',
  imports: [Button, Card, ImageFallback],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss',
})
export class PhotoDetail {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  private readonly favoriteEntities = this.store.selectSignal(
    favoritesFeature.selectEntities,
  );

  protected readonly photo = computed(() => this.favoriteEntities()[this.id()]);

  protected remove(): void {
    this.store.dispatch(FavoritesActions.removeFavorite({ id: this.id() }));
    this.router.navigate(['/favorites']);
  }
}
