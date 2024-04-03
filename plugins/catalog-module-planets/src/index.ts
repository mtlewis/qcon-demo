import { createPlugin } from '@backstage/frontend-plugin-api';
import extensions from './extensions';

export default createPlugin({
  id: 'planets',
  extensions: [...extensions],
});
