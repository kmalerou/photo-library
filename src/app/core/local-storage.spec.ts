import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { LocalStorage } from './local-storage';

describe('LocalStorage', () => {
  let service: LocalStorage;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorage);
  });

  it('returns null when the key is not set', () => {
    expect(service.getItem('missing')).toBeNull();
  });

  it('round-trips a JSON-serializable value', () => {
    service.setItem('favorites', { a: 1 });

    expect(service.getItem('favorites')).toEqual({ a: 1 });
  });

  it('returns null when the stored value is invalid JSON', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('not-json');

    expect(service.getItem('favorites')).toBeNull();

    getItem.mockRestore();
  });

  it('removes a single key', () => {
    service.setItem('favorites', { a: 1 });
    service.setItem('other', { b: 2 });

    service.removeItem('favorites');

    expect(service.getItem('favorites')).toBeNull();
    expect(service.getItem('other')).toEqual({ b: 2 });
  });

  it('clears every key', () => {
    service.setItem('favorites', { a: 1 });
    service.setItem('other', { b: 2 });

    service.clear();

    expect(service.getItem('favorites')).toBeNull();
    expect(service.getItem('other')).toBeNull();
  });
});
