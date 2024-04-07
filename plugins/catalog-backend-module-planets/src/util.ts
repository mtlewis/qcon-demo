import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';
import { PlanetDefinition } from './types';

const PLANETS_API = 'http://localhost:8000/api/planets.json';

export const fetchPlanets = async () => {
  const planetsResponse = await fetch(PLANETS_API);
  return planetsResponse.json();
};

export const toResourceEntity = ({
  name,
  image,
  secrecy,
}: PlanetDefinition) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Resource',
  metadata: {
    name,
    annotations: {
      [ANNOTATION_LOCATION]: `url:${PLANETS_API}`,
      [ANNOTATION_ORIGIN_LOCATION]: `url:${PLANETS_API}`,
      'qcon-demo.com/image': new URL(image, PLANETS_API),
      'qcon-demo.com/secrecy': secrecy,
    },
  },
  spec: {
    type: 'planet',
    owner: 'user:default/guest',
  },
});
