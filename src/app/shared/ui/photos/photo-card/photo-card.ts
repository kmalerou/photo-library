import { Component, input, output } from '@angular/core';

import { Photo } from '@shared/models/photo';
import { Card } from '@shared/ui/card/card';
import { ImageFallback } from '@shared/ui/image-fallback';

@Component({
  selector: 'app-photo-card',
  imports: [Card, ImageFallback],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly cardClick = output<void>();
}
