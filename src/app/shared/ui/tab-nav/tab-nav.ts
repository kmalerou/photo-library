import { Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface TabNavLink {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-tab-nav',
  imports: [MatTabsModule, RouterLink, RouterLinkActive],
  templateUrl: './tab-nav.html',
  styleUrl: './tab-nav.scss',
})
export class TabNav {
  readonly links = input.required<TabNavLink[]>();
}
