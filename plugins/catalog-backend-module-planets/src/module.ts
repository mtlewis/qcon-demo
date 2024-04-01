import fetch from 'node-fetch';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

const PROVIDER_NAME = 'planets';
const PLANETS_API = 'http://localhost:8000/api/planets.json';

const toResourceEntity = (name: string, image: string) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Resource',
  metadata: {
    name,
    annotations: {
      [ANNOTATION_LOCATION]: `url:${PLANETS_API}`,
      [ANNOTATION_ORIGIN_LOCATION]: `url:${PLANETS_API}`,
      image: new URL(image, PLANETS_API),
    },
  },
  spec: {
    type: 'planet',
    owner: 'user:default/guest',
  },
});

export const catalogBackendModulePlanets = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'planets',
  register(reg) {
    reg.registerInit({
      deps: {
        catalogProcessing: catalogProcessingExtensionPoint,
        scheduler: coreServices.scheduler,
      },
      async init({ catalogProcessing, scheduler }) {
        catalogProcessing.addEntityProvider({
          getProviderName: () => PROVIDER_NAME,
          connect: async connection => {
            await scheduler.scheduleTask({
              id: `${PROVIDER_NAME}:fetch`,
              frequency: { seconds: 5 },
              timeout: { seconds: 1 },
              fn: async () => {
                const planetsResponse = await fetch(PLANETS_API);
                const planets = await planetsResponse.json();

                await connection.applyMutation({
                  type: 'full',
                  entities: planets.map(
                    ({ name, image }: { name: string; image: string }) => ({
                      locationKey: PROVIDER_NAME,
                      entity: toResourceEntity(name, image),
                    }),
                  ),
                });
              },
            });
          },
        });
      },
    });
  },
});
