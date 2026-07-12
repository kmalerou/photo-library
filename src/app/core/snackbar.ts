import { Service, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURATION_MS = 3000;

export type SnackbarType = 'success' | 'warn';

@Service()
export class Snackbar {
  private readonly snackBar = inject(MatSnackBar);

  open(message: string, type: SnackbarType = 'success'): void {
    this.snackBar.open(message, '✕', {
      duration: DURATION_MS,
      panelClass: `snackbar--${type}`,
    });
  }
}
