import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Photo } from '@shared/models/photo';

export const PhotoStreamActions = createActionGroup({
  source: 'Photo Stream',
  events: {
    'Load Photos': emptyProps(),
    'Load Photos Success': props<{ photos: Photo[]; hasMore: boolean }>(),
    'Load Photos Failure': props<{ error: string }>(),
    Reset: emptyProps(),
  },
});
