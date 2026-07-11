import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Header } from './header';

describe('Header', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Header },
          { path: 'favorites', component: Header },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('renders links to Photos and Favorites', async () => {
    await harness.navigateByUrl('/', Header);

    const anchors = harness.routeNativeElement!.querySelectorAll('a');

    expect(anchors.length).toBe(2);
    expect(anchors[0].textContent?.trim()).toBe('Photos');
    expect(anchors[0].getAttribute('href')).toBe('/');
    expect(anchors[1].textContent?.trim()).toBe('Favorites');
    expect(anchors[1].getAttribute('href')).toBe('/favorites');
  });
});
