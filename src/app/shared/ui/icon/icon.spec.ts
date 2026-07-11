import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Icon } from './icon';

describe('Icon', () => {
  let fixture: ComponentFixture<Icon>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Icon] });
    fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'favorite');
  });

  it('renders the given icon name', async () => {
    await fixture.whenStable();

    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon?.textContent?.trim()).toBe('favorite');
  });
});
