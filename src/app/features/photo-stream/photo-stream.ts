import { Component } from '@angular/core';

import { Photo } from '@shared/models/photo';
import { PhotoGrid } from '@shared/ui/photos/photo-grid/photo-grid';

@Component({
  selector: 'app-photo-stream',
  imports: [PhotoGrid],
  templateUrl: './photo-stream.html',
  styleUrl: './photo-stream.scss',
})
export class PhotoStream {
  protected readonly photos: Photo[] = Array.from({ length: 12 }, (_, index) => {
    const id = index + 1;
    return {
      id: String(id),
      author: `Author ${id}`,
      url: `https://picsum.photos/id/${id}/400/300`,
      width: 400,
      height: 300,
    };
  });
}
