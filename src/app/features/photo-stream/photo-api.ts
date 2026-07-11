import { Service, inject } from '@angular/core';
import { Observable, delay, map } from 'rxjs';

import { Api } from '@core/api';
import { Photo } from '@shared/models/photo';

const PICSUM_LIST_URL = 'https://picsum.photos/v2/list';
const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 300;

export type FetchedPhoto = Omit<Photo, 'isFavorite'>;

interface PicsumPhotoResponse {
  readonly id: string;
  readonly author: string;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly download_url: string;
}

@Service()
export class PhotoApi {
  private readonly api = inject(Api);

  getPhotos(page: number, limit: number): Observable<FetchedPhoto[]> {
    return this.api.get<PicsumPhotoResponse[]>(PICSUM_LIST_URL, { page, limit }).pipe(
      delay(randomDelay()),
      map((photos) => photos.map(toPhoto)),
    );
  }
}

function toPhoto(response: PicsumPhotoResponse): FetchedPhoto {
  return {
    id: response.id,
    author: response.author,
    url: response.download_url,
    width: response.width,
    height: response.height,
  };
}

function randomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}
