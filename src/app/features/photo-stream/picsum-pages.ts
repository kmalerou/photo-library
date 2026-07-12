import { Service } from '@angular/core';

const MAX_PAGE = 50;

@Service()
export class PicsumPages {
  private remainingPages: number[] = this.createRandomPagePool();

  get hasRemainingPages(): boolean {
    return this.remainingPages.length > 0;
  }

  getNextPage(): number | null {
    return this.remainingPages.pop() ?? null;
  }

  reset(): void {
    this.remainingPages = this.createRandomPagePool();
  }

  private createRandomPagePool(): number[] {
    const pages = Array.from({ length: MAX_PAGE }, (_, index) => index + 1);

    for (let i = pages.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [pages[i], pages[randomIndex]] = [pages[randomIndex], pages[i]];
    }

    return pages;
  }
}
