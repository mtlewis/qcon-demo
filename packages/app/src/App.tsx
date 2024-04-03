import React from 'react';
import { createApp } from '@backstage/frontend-app-api';
import {
  createApiExtension,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';
import {
  createApiFactory,
  configApiRef,
  SignInPageProps,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import appVisualizerPlugin from '@backstage/plugin-app-visualizer';
import homePlugin from '@backstage/plugin-home/alpha';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { createSignInPageExtension } from '@backstage/frontend-plugin-api';
import { SignInPage } from '@backstage/core-components';

const signInPage = createSignInPageExtension({
  name: 'default',
  loader: async () => (props: SignInPageProps) =>
    (
      <SignInPage
        {...props}
        auto
        providers={[
          'guest',
          {
            id: 'github-auth-provider',
            title: 'GitHub',
            message: 'Sign in using GitHub',
            apiRef: githubAuthApiRef,
          },
        ]}
      />
    ),
});

const scmAuthExtension = createApiExtension({
  factory: ScmAuth.createDefaultApiFactory(),
});

const scmIntegrationApi = createApiExtension({
  factory: createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
});

const app = createApp({
  features: [
    techdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    appVisualizerPlugin,
    createExtensionOverrides({
      extensions: [scmAuthExtension, scmIntegrationApi, signInPage],
    }),
  ],
});

export default app.createRoot();
