import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  PolicyDecision,
  isResourcePermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint as policyExtensionPointRef } from '@backstage/plugin-permission-node/alpha';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';

class LocalPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse | undefined,
  ): Promise<PolicyDecision> {
    if (user?.identity.ownershipEntityRefs.includes('group:default/admins')) {
      return { result: AuthorizeResult.ALLOW };
    }

    if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(request.permission, {
        not: catalogConditions.hasAnnotation({
          annotation: 'qcon-demo.com/secrecy',
          value: 'secret',
        }),
      });
    }

    return { result: AuthorizeResult.ALLOW };
  }
}

export const permissionModulePolicy = createBackendModule({
  pluginId: 'permission',
  moduleId: 'policy',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        policyExtensionPoint: policyExtensionPointRef,
      },
      async init({ policyExtensionPoint }) {
        policyExtensionPoint.setPolicy(new LocalPolicy());
      },
    });
  },
});
