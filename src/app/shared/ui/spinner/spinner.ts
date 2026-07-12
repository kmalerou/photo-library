import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const DEFAULT_DIAMETER = 48;
const DEFAULT_ARIA_LABEL = 'Loading';

@Component({
  selector: 'app-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
  readonly diameter = input(DEFAULT_DIAMETER);
  readonly ariaLabel = input(DEFAULT_ARIA_LABEL);
}
