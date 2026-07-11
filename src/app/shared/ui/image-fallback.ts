import { Directive, ElementRef, inject } from '@angular/core';

const FALLBACK_IMAGE = 'assets/image-fallback.svg';

@Directive({
  selector: 'img[appImageFallback]',
  host: {
    '(error)': 'onError()',
  },
})
export class ImageFallback {
  private readonly elementRef = inject<ElementRef<HTMLImageElement>>(ElementRef);

  protected onError(): void {
    this.elementRef.nativeElement.src = FALLBACK_IMAGE;
  }
}
