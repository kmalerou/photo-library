import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  production: false,
  devtoolsProviders: [provideStoreDevtools({ maxAge: 25 })],
};
