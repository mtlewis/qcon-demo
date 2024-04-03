import React from 'react';
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';
import { compatWrapper } from '@backstage/core-compat-api';

export const catalogPlanetImageCard = createEntityCardExtension({
  name: 'planet-image',
  loader: async () =>
    import('./components/PlanetImageCard').then(m =>
      compatWrapper(<m.PlanetImageCard />),
    ),
});
