import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MatTabLink } from '@angular/material/tabs';

import { TabNav, TabNavLink } from './tab-nav';

@Component({
  selector: 'app-tab-nav-test-host',
  imports: [TabNav],
  template: `<app-tab-nav [links]="links" />`,
})
class TestHost {
  readonly links: TabNavLink[] = [
    { label: 'Photos', path: '/' },
    { label: 'Favorites', path: '/favorites' },
  ];
}

describe('TabNav', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: TestHost },
          { path: 'favorites', component: TestHost },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('renders a link for each provided route', async () => {
    await harness.navigateByUrl('/', TestHost);

    const anchors = harness.routeNativeElement?.querySelectorAll('a');

    expect(anchors?.length).toBe(2);
    expect(anchors?.[0].textContent?.trim()).toBe('Photos');
    expect(anchors?.[1].textContent?.trim()).toBe('Favorites');
  });

  it('marks the link matching the current URL as active', async () => {
    await harness.navigateByUrl('/', TestHost);
    await harness.fixture.whenStable();

    const tabLinks = harness.routeDebugElement!.queryAll(
      By.directive(MatTabLink),
    );

    expect(tabLinks[0].injector.get(MatTabLink).active).toBe(true);
    expect(tabLinks[1].injector.get(MatTabLink).active).toBe(false);
  });

  it('updates the active link after navigating', async () => {
    await harness.navigateByUrl('/', TestHost);
    await harness.navigateByUrl('/favorites', TestHost);
    await harness.fixture.whenStable();

    const tabLinks = harness.routeDebugElement!.queryAll(
      By.directive(MatTabLink),
    );

    expect(tabLinks[0].injector.get(MatTabLink).active).toBe(false);
    expect(tabLinks[1].injector.get(MatTabLink).active).toBe(true);
  });
});
