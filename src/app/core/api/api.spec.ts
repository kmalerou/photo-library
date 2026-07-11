import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Api, ApiError } from './api';

describe('Api', () => {
  let service: Api;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Api);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('issues a GET request to the given URL', () => {
    service.get<{ id: string }>('https://example.com/photos').subscribe();

    const req = httpMock.expectOne('https://example.com/photos');
    expect(req.request.method).toBe('GET');
    req.flush({ id: '1' });
  });

  it('serializes params onto the request', () => {
    service.get('https://example.com/photos', { page: 2, limit: 10 }).subscribe();

    const req = httpMock.expectOne((request) => request.url === 'https://example.com/photos');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush({});
  });

  it('maps HTTP errors to an ApiError', () => {
    let error: ApiError | undefined;
    service.get('https://example.com/photos').subscribe({
      error: (err) => (error = err),
    });

    const req = httpMock.expectOne('https://example.com/photos');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(error?.status).toBe(404);
    expect(error?.message).toContain('404');
  });
});
