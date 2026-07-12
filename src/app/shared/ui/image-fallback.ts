import { Directive, ElementRef, inject } from '@angular/core';

const FALLBACK_IMAGE = 'assets/image-fallback.svg';

@Directive({
  selector: 'img[appImageFallback]',
  host: {
    '(error)': 'applyFallback()',
  },
})
export class ImageFallback {
  private readonly elementRef = inject<ElementRef<HTMLImageElement>>(ElementRef);

  protected applyFallback(): void {
    this.elementRef.nativeElement.src = FALLBACK_IMAGE;
  }
}
