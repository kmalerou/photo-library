import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { InfiniteScroll } from './infinite-scroll';

@Component({
  selector: 'app-infinite-scroll-test-host',
  imports: [InfiniteScroll],
  template: `<div appInfiniteScroll [disabled]="disabled()" (scrolled)="onScrolled()"></div>`,
})
class TestHost {
  readonly disabled = signal(false);
  readonly onScrolled = vi.fn();
}

describe('InfiniteScroll', () => {
  let fixture: ComponentFixture<TestHost>;
  let observeSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;
  let intersectionCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(function (callback: typeof intersectionCallback) {
        intersectionCallback = callback;
        return { observe: observeSpy, disconnect: disconnectSpy };
      }),
    );

    TestBed.configureTestingModule({ imports: [TestHost] });
    fixture = TestBed.createComponent(TestHost);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('observes the host element on init', async () => {
    await fixture.whenStable();

    expect(observeSpy).toHaveBeenCalled();
  });

  it('emits scrolled when the element intersects and is not disabled', async () => {
    await fixture.whenStable();

    intersectionCallback([{ isIntersecting: true }]);

    expect(fixture.componentInstance.onScrolled).toHaveBeenCalled();
  });

  it('does not emit scrolled when disabled', async () => {
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();

    intersectionCallback([{ isIntersecting: true }]);

    expect(fixture.componentInstance.onScrolled).not.toHaveBeenCalled();
  });

  it('does not emit scrolled when not intersecting', async () => {
    await fixture.whenStable();

    intersectionCallback([{ isIntersecting: false }]);

    expect(fixture.componentInstance.onScrolled).not.toHaveBeenCalled();
  });

  it('disconnects the observer on destroy', async () => {
    await fixture.whenStable();

    fixture.destroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
