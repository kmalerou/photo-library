import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card } from './card';

describe('Card', () => {
  let fixture: ComponentFixture<Card>;
  let component: Card;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Card] });
    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
  });

  it('does not set role/tabindex when not interactive', async () => {
    fixture.componentRef.setInput('interactive', false);
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card.getAttribute('role')).toBeNull();
    expect(card.getAttribute('tabindex')).toBeNull();
  });

  it('does not emit cardClick when not interactive', async () => {
    fixture.componentRef.setInput('interactive', false);
    await fixture.whenStable();

    let emitted = false;
    component.cardClick.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('mat-card').click();
    await fixture.whenStable();

    expect(emitted).toBe(false);
  });

  it('sets role and tabindex when interactive', async () => {
    fixture.componentRef.setInput('interactive', true);
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('tabindex')).toBe('0');
  });

  it('emits cardClick on click when interactive', async () => {
    fixture.componentRef.setInput('interactive', true);
    await fixture.whenStable();

    let emitted = false;
    component.cardClick.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('mat-card').click();
    await fixture.whenStable();

    expect(emitted).toBe(true);
  });

  it('does not render a header when title is not set', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-card-header')).toBeNull();
  });

  it('renders the title inside a card header when set', async () => {
    fixture.componentRef.setInput('title', 'Photo by Jane Doe');
    await fixture.whenStable();

    const title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent.trim()).toBe('Photo by Jane Doe');
  });

  it('emits cardClick on Enter key when interactive', async () => {
    fixture.componentRef.setInput('interactive', true);
    await fixture.whenStable();

    let emitted = false;
    component.cardClick.subscribe(() => (emitted = true));

    fixture.nativeElement
      .querySelector('mat-card')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();

    expect(emitted).toBe(true);
  });

  it('emits cardClick on Space key when interactive', async () => {
    fixture.componentRef.setInput('interactive', true);
    await fixture.whenStable();

    let emitted = false;
    component.cardClick.subscribe(() => (emitted = true));

    fixture.nativeElement
      .querySelector('mat-card')
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }),
      );
    await fixture.whenStable();

    expect(emitted).toBe(true);
  });

  it('does not emit cardClick on Space key when not interactive', async () => {
    fixture.componentRef.setInput('interactive', false);
    await fixture.whenStable();

    let emitted = false;
    component.cardClick.subscribe(() => (emitted = true));

    fixture.nativeElement
      .querySelector('mat-card')
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }),
      );
    await fixture.whenStable();

    expect(emitted).toBe(false);
  });
});
