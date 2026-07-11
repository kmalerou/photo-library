import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Api } from '@core/api';

import { PhotoApi } from './photo-api';

describe('PhotoApi', () => {
  let service: PhotoApi;
  let apiGet: ReturnType<typeof vi.fn>;

  const mockResponse = [
    {
      id: '1',
      author: 'Jane Doe',
      width: 5000,
      height: 3333,
      url: 'https://unsplash.com/photos/1',
      download_url: 'https://picsum.photos/id/1/5000/3333',
    },
  ];

  beforeEach(() => {
    apiGet = vi.fn().mockReturnValue(of(mockResponse));

    TestBed.configureTestingModule({
      providers: [{ provide: Api, useValue: { get: apiGet } }],
    });

    service = TestBed.inject(PhotoApi);
  });

  it('requests the Picsum list endpoint with page/limit params', () => {
    service.getPhotos(2, 20).subscribe();

    expect(apiGet).toHaveBeenCalledWith('https://picsum.photos/v2/list', {
      page: 2,
      limit: 20,
    });
  });

  it('maps the response to the Photo shape, using download_url as the image url', async () => {
    const photos = await new Promise((resolve) => {
      service.getPhotos(1, 10).subscribe(resolve);
    });

    expect(photos).toEqual([
      {
        id: '1',
        author: 'Jane Doe',
        url: 'https://picsum.photos/id/1/5000/3333',
        width: 5000,
        height: 3333,
      },
    ]);
  });
});
