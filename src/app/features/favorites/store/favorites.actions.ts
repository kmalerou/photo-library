import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Photo } from '@shared/models/photo';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Load Favorites': emptyProps(),
    'Load Favorites Success': props<{ entities: Record<string, Photo> }>(),
    'Load Favorites Failure': props<{ error: string }>(),
    'Add Favorite': props<{ photo: Photo }>(),
    'Add Favorite Success': props<{ photo: Photo }>(),
    'Add Favorite Failure': props<{ error: string }>(),
    'Add Favorite Duplicate': emptyProps(),
    'Remove Favorite': props<{ id: string }>(),
    'Remove Favorite Success': props<{ id: string }>(),
    'Remove Favorite Failure': props<{ error: string }>(),
  },
});
