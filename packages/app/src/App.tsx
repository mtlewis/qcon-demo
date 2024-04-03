import React from 'react';
import { Navigate } from 'react-router';
import { createApp } from '@backstage/frontend-app-api';
import {
  createApiExtension,
  createExtensionOverrides,
  createPageExtension,
} from '@backstage/frontend-plugin-api';
import {
  createApiFactory,
  configApiRef,
  SignInPageProps,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
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

const homePage = createPageExtension({
  name: 'home',
  defaultPath: '/',
  loader: async () => <Navigate to="/catalog" />,
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
    createExtensionOverrides({
      extensions: [homePage, scmAuthExtension, scmIntegrationApi, signInPage],
    }),
  ],
});

export default app.createRoot();
