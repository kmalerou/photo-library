import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  readonly disabled = input(false);
  readonly scrolled = output<void>();

  ngOnInit(): void {
    const root = this.elementRef.nativeElement.closest('main');

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.disabled()) {
          this.scrolled.emit();
        }
      },
      { root },
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
