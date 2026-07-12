import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

import { Snackbar } from './snackbar';

describe('Snackbar', () => {
  let open: ReturnType<typeof vi.fn>;
  let dismiss: ReturnType<typeof vi.fn>;
  let snackbar: Snackbar;

  beforeEach(() => {
    open = vi.fn();
    dismiss = vi.fn();

    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: { open, dismiss } }],
    });

    snackbar = TestBed.inject(Snackbar);
  });

  it('defaults to the success panel class', () => {
    snackbar.open('Added to favorites');

    expect(open).toHaveBeenCalledWith('Added to favorites', '✕', {
      duration: 3000,
      panelClass: 'snackbar--success',
    });
  });

  it('uses the warn panel class when specified', () => {
    snackbar.open('Removed from favorites', 'warn');

    expect(open).toHaveBeenCalledWith('Removed from favorites', '✕', {
      duration: 3000,
      panelClass: 'snackbar--warn',
    });
  });

  it('dismisses the current snackbar', () => {
    snackbar.dismiss();

    expect(dismiss).toHaveBeenCalled();
  });
});
