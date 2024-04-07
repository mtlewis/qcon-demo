import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { fetchPlanets, toResourceEntity } from './util';
import { PlanetDefinition } from './types';

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
          getProviderName: () => 'planets',
          connect: async connection => {
            await scheduler.scheduleTask({
              id: 'planets:fetch',
              frequency: { seconds: 5 },
              timeout: { seconds: 1 },
              fn: async () => {
                logger.info(`Refreshing planet resources...`);
                const planets = await fetchPlanets();

                await connection.applyMutation({
                  type: 'full',
                  entities: planets.map((definition: PlanetDefinition) => ({
                    locationKey: 'planets',
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
