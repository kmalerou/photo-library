import { Component, input, output } from '@angular/core';

import { Photo } from '@shared/models/photo';
import { Card } from '@shared/ui/card/card';
import { Icon } from '@shared/ui/icon/icon';
import { ImageFallback } from '@shared/ui/image-fallback';

export type PhotoCardBadge = 'favorite';

@Component({
  selector: 'app-photo-card',
  imports: [Card, Icon, ImageFallback],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly badge = input<PhotoCardBadge | null>(null);
  readonly cardClick = output<void>();
}
