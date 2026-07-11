import { Component, input, output } from '@angular/core';

import { Photo } from '@shared/models/photo';
import { Card } from '@shared/ui/card/card';
import { Icon } from '@shared/ui/icon/icon';

@Component({
  selector: 'app-photo-card',
  imports: [Card, Icon],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly isFavorite = input(false);
  readonly cardClick = output<void>();
}
