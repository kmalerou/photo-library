import { Component, input, output } from '@angular/core';

import { Button } from '@shared/ui/button/button';
import { Icon } from '@shared/ui/icon/icon';

@Component({
  selector: 'app-empty-state',
  imports: [Button, Icon],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly message = input.required<string>();
  readonly icon = input('inbox');
  readonly actionText = input<string>();
  readonly action = output<void>();
}
