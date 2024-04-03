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

type PlanetDefinition = {
  name: string;
  image: string;
  secrecy: 'public' | 'secret';
};

const PROVIDER_NAME = 'planets';
const PLANETS_API = 'http://localhost:8000/api/planets.json';

const toResourceEntity = ({ name, image, secrecy }: PlanetDefinition) => ({
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

export const catalogBackendModulePlanets = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'planets',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        catalogProcessing: catalogProcessingExtensionPoint,
      },
      async init({ catalogProcessing, logger, scheduler }) {
        catalogProcessing.addEntityProvider({
          getProviderName: () => PROVIDER_NAME,
          connect: async connection => {
            await scheduler.scheduleTask({
              id: `${PROVIDER_NAME}:fetch`,
              frequency: { seconds: 5 },
              timeout: { seconds: 1 },
              fn: async () => {
                logger.info(`Refreshing planet resources...`);
                const planetsResponse = await fetch(PLANETS_API);
                const planets = await planetsResponse.json();

                await connection.applyMutation({
                  type: 'full',
                  entities: planets.map((definition: PlanetDefinition) => ({
                    locationKey: PROVIDER_NAME,
                    entity: toResourceEntity(definition),
                  })),
                });
              },
            });
          },
        });
      },
    });
  },
});
