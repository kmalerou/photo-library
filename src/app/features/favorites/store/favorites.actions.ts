import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Photo } from '@shared/models/photo';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Add Favorite': props<{ photo: Photo }>(),
    'Add Favorite Success': props<{ photo: Photo }>(),
    'Add Favorite Duplicate': emptyProps(),
    'Remove Favorite': props<{ id: string }>(),
  },
});
