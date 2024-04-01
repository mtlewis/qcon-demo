/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
import { featureDiscoveryServiceFactory } from '@backstage/backend-app-api/alpha';

const backend = createBackend();

backend.add(featureDiscoveryServiceFactory());

backend.start();
