export interface Photo {
  readonly id: string;
  readonly author: string;
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly isFavorite: boolean;
}
