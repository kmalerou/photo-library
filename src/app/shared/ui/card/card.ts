import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card',
  imports: [MatCardModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly interactive = input(false);
  readonly cardClick = output<void>();

  protected onClick(): void {
    if (this.interactive()) {
      this.cardClick.emit();
    }
  }

  protected onSpace(event: Event): void {
    if (this.interactive()) {
      event.preventDefault();
      this.cardClick.emit();
    }
  }
}
