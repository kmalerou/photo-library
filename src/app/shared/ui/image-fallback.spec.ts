import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFallback } from './image-fallback';

@Component({
  selector: 'app-image-fallback-test-host',
  imports: [ImageFallback],
  template: `<img appImageFallback src="https://example.com/broken.jpg" alt="test" />`,
})
class TestHost {}

describe('ImageFallback', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHost] });
    fixture = TestBed.createComponent(TestHost);
  });

  it('swaps the image src to the fallback asset on error', async () => {
    await fixture.whenStable();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    img.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(img.src).toContain('assets/image-fallback.svg');
  });
});
