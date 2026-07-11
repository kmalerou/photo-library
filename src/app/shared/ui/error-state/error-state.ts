import { Component, input, output } from '@angular/core';

import { Button } from '@shared/ui/button/button';
import { Icon } from '@shared/ui/icon/icon';

@Component({
  selector: 'app-error-state',
  imports: [Button, Icon],
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorState {
  readonly message = input('Something went wrong.');
  readonly retry = output<void>();
}
