import { Component, input, output } from '@angular/core';

import { Photo } from '@shared/models/photo';
import { Card } from '@shared/ui/card/card';
import { Icon } from '@shared/ui/icon/icon';
import { ImageFallback } from '@shared/ui/image-fallback';

@Component({
  selector: 'app-photo-card',
  imports: [Card, Icon, ImageFallback],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly cardClick = output<void>();
}
