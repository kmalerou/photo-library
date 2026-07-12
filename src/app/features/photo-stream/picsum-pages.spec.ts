import { TestBed } from '@angular/core/testing';

import { PicsumPages } from './picsum-pages';

describe('PicsumPages', () => {
  let service: PicsumPages;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PicsumPages);
  });

  it('starts with a full pool of pages available', () => {
    expect(service.hasRemainingPages).toBe(true);
  });

  it('returns pages within the valid range', () => {
    for (let i = 0; i < 50; i++) {
      const page = service.getNextPage();
      expect(page).toBeGreaterThanOrEqual(1);
      expect(page).toBeLessThanOrEqual(50);
    }
  });

  it('does not return the same page twice before the pool is exhausted', () => {
    const seen = new Set<number>();

    for (let i = 0; i < 50; i++) {
      const page = service.getNextPage();
      expect(page).not.toBeNull();
      expect(seen.has(page as number)).toBe(false);
      seen.add(page as number);
    }

    expect(seen.size).toBe(50);
  });

  it('returns null once the pool is exhausted', () => {
    for (let i = 0; i < 50; i++) {
      service.getNextPage();
    }

    expect(service.hasRemainingPages).toBe(false);
    expect(service.getNextPage()).toBeNull();
  });

  it('refills the pool on reset', () => {
    for (let i = 0; i < 50; i++) {
      service.getNextPage();
    }

    service.reset();

    expect(service.hasRemainingPages).toBe(true);
    expect(service.getNextPage()).not.toBeNull();
  });
});
