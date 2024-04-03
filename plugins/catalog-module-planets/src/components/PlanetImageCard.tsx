import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard } from '@backstage/core-components';

export const PlanetImageCard = () => {
  const { entity } = useEntity();

  return (
    <InfoCard title="Image" variant="gridItem">
      <img
        src={entity.metadata.annotations!['qcon-demo.com/image']}
        alt={`Planet ${entity.metadata.name} taken from space`}
        height="250px"
      />
    </InfoCard>
  );
};
