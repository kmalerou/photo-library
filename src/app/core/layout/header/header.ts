import { Component } from '@angular/core';

import { TabNav, TabNavLink } from '../../../shared/ui/tab-nav/tab-nav';

@Component({
  selector: 'app-header',
  imports: [TabNav],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly links: TabNavLink[] = [
    { label: 'Photos', path: '/' },
    { label: 'Favorites', path: '/favorites' },
  ];
}
