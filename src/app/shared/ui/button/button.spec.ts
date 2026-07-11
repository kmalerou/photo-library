import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;
  let component: Button;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Button] });
    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Retry');
  });

  it('renders the given text', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent.trim()).toBe('Retry');
  });

  it('renders an icon when provided', async () => {
    fixture.componentRef.setInput('icon', 'refresh');
    await fixture.whenStable();

    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon?.textContent?.trim()).toBe('refresh');
  });

  it('renders no icon when not provided', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-icon')).toBeNull();
  });

  it('emits buttonClick when clicked', async () => {
    await fixture.whenStable();

    let emitted = false;
    component.buttonClick.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(emitted).toBe(true);
  });

  it('does not emit when disabled', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    let emitted = false;
    component.buttonClick.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(emitted).toBe(false);
  });
});
