import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Icon } from '@shared/ui/icon/icon';

type ButtonAppearance = 'text' | 'filled' | 'elevated' | 'outlined' | 'tonal';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, Icon],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly text = input.required<string>();
  readonly icon = input<string>();
  readonly appearance = input<ButtonAppearance>('filled');
  readonly disabled = input(false);
  readonly buttonClick = output<void>();
}
