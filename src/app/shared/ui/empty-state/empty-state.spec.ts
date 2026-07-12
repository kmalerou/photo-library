import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyState>;
  let component: EmptyState;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EmptyState] });
    fixture = TestBed.createComponent(EmptyState);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('message', 'No favorites yet.');
  });

  it('renders the given message', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('p').textContent.trim()).toBe(
      'No favorites yet.',
    );
  });

  it('renders no action button when actionText is not provided', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('renders and wires the action button when actionText is provided', async () => {
    fixture.componentRef.setInput('actionText', 'Browse photos');
    await fixture.whenStable();

    let emitted = false;
    component.action.subscribe(() => (emitted = true));

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('Browse photos');

    button.click();
    await fixture.whenStable();

    expect(emitted).toBe(true);
  });
});
