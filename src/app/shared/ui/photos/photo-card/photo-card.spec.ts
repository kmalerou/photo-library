import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photo } from '@shared/models/photo';

import { PhotoCard } from './photo-card';

describe('PhotoCard', () => {
  let fixture: ComponentFixture<PhotoCard>;
  let component: PhotoCard;

  const photo: Photo = {
    id: '1',
    author: 'Jane Doe',
    url: 'https://picsum.photos/id/1/300/200',
    width: 300,
    height: 200,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PhotoCard] });
    fixture = TestBed.createComponent(PhotoCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photo', photo);
  });

  it('renders the photo image with author alt text', async () => {
    await fixture.whenStable();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe(photo.url);
    expect(img.alt).toBe('Photo by Jane Doe');
  });

  it('emits cardClick when clicked', async () => {
    await fixture.whenStable();

    let emitted = false;
    component.cardClick.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('mat-card').click();
    await fixture.whenStable();

    expect(emitted).toBe(true);
  });

  it('renders no badge by default', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.badge-scrim')).toBeNull();
  });

  it('renders the favorite badge when requested', async () => {
    fixture.componentRef.setInput('badge', 'favorite');
    await fixture.whenStable();

    const scrim = fixture.nativeElement.querySelector('.badge-scrim--favorite');
    const icon = scrim?.querySelector('.badge-icon');
    expect(icon?.textContent?.trim()).toBe('favorite');
  });
});
