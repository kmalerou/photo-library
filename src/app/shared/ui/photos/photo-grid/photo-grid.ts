import { Component, input, output } from '@angular/core';

import { Photo } from '@shared/models/photo';
import { Grid } from '@shared/ui/grid/grid';
import { PhotoCard } from '@shared/ui/photos/photo-card/photo-card';

@Component({
  selector: 'app-photo-grid',
  imports: [Grid, PhotoCard],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  readonly photoClick = output<Photo>();
}
