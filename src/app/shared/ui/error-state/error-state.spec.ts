import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorState } from './error-state';

describe('ErrorState', () => {
  let fixture: ComponentFixture<ErrorState>;
  let component: ErrorState;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ErrorState] });
    fixture = TestBed.createComponent(ErrorState);
    component = fixture.componentInstance;
  });

  it('renders a default message', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('p').textContent.trim()).toBe(
      'Something went wrong.',
    );
  });

  it('renders a custom message', async () => {
    fixture.componentRef.setInput('message', 'Could not load photos.');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('p').textContent.trim()).toBe(
      'Could not load photos.',
    );
  });

  it('emits retry when the button is clicked', async () => {
    await fixture.whenStable();

    let emitted = false;
    component.retry.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(emitted).toBe(true);
  });
});
