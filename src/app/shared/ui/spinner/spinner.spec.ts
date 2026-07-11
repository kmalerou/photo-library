import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spinner } from './spinner';

describe('Spinner', () => {
  let fixture: ComponentFixture<Spinner>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Spinner] });
    fixture = TestBed.createComponent(Spinner);
  });

  it('defaults to a 48px diameter', async () => {
    await fixture.whenStable();

    const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
    expect(spinner.style.width).toBe('48px');
  });

  it('applies a custom diameter', async () => {
    fixture.componentRef.setInput('diameter', 24);
    await fixture.whenStable();

    const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
    expect(spinner.style.width).toBe('24px');
  });
});
