import { Component, input, output } from '@angular/core';

import { Photo } from '../../../models/photo';
import { Card } from '../../card/card';
import { Icon } from '../../icon/icon';

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
