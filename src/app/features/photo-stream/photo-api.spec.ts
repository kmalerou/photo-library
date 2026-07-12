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

  it('requests the Picsum list endpoint with a page in range and a fixed page size', () => {
    service.getPhotos().subscribe();

    expect(apiGet).toHaveBeenCalledWith(
      'https://picsum.photos/v2/list',
      expect.objectContaining({ limit: 20 }),
    );
    const requestedPage = apiGet.mock.calls[0][1].page;
    expect(requestedPage).toBeGreaterThanOrEqual(1);
    expect(requestedPage).toBeLessThanOrEqual(50);
  });

  it('maps the response to the Photo shape and reports more pages remaining', async () => {
    const result = await new Promise((resolve) => {
      service.getPhotos().subscribe(resolve);
    });

    expect(result).toEqual({
      photos: [
        {
          id: '1',
          author: 'Jane Doe',
          url: 'https://picsum.photos/id/1/5000/3333',
          width: 5000,
          height: 3333,
        },
      ],
      hasMore: true,
    });
  });

  it('reports hasMore as false and skips the request once every page has been used', () => {
    for (let i = 0; i < 50; i++) {
      service.getPhotos().subscribe();
    }
    apiGet.mockClear();

    let result: { photos: unknown[]; hasMore: boolean } | undefined;
    service.getPhotos().subscribe((value) => (result = value));

    expect(apiGet).not.toHaveBeenCalled();
    expect(result).toEqual({ photos: [], hasMore: false });
  });
});
