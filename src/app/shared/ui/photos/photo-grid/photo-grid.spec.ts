import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photo } from '@shared/models/photo';

import { PhotoGrid } from './photo-grid';

describe('PhotoGrid', () => {
  let fixture: ComponentFixture<PhotoGrid>;
  let component: PhotoGrid;

  const photos: Photo[] = [
    {
      id: '1',
      author: 'Jane Doe',
      url: 'https://picsum.photos/id/1/300/200',
      width: 300,
      height: 200,
    },
    {
      id: '2',
      author: 'John Smith',
      url: 'https://picsum.photos/id/2/300/200',
      width: 300,
      height: 200,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PhotoGrid] });
    fixture = TestBed.createComponent(PhotoGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photos', photos);
  });

  it('renders a card for each photo', async () => {
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('app-photo-card');
    expect(cards.length).toBe(2);
  });

  it('emits photoClick with the corresponding photo when a card is clicked', async () => {
    await fixture.whenStable();

    let clicked: Photo | undefined;
    component.photoClick.subscribe((photo) => (clicked = photo));

    const secondCard = fixture.nativeElement.querySelectorAll('mat-card')[1];
    secondCard.click();
    await fixture.whenStable();

    expect(clicked).toEqual(photos[1]);
  });

  it('forwards the badge input to every card', async () => {
    fixture.componentRef.setInput('badge', 'favorite');
    await fixture.whenStable();

    const badges = fixture.nativeElement.querySelectorAll(
      '.badge-scrim--favorite',
    );
    expect(badges.length).toBe(2);
  });
});
