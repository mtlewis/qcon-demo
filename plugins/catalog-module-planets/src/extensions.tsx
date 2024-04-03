import React from 'react';
import { compatWrapper } from '@backstage/core-compat-api';
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';

const planetImageCardExtension = createEntityCardExtension({
  name: 'planet-image',
  filter: 'kind:resource type:planet',
  loader: async () =>
    import('./components/PlanetImageCard').then(m =>
      compatWrapper(<m.PlanetImageCard />),
    ),
});

export default [planetImageCardExtension];
