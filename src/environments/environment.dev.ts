import { baseEnvironment } from '@environment/environment.base';

export const environment = {
  ...baseEnvironment,
  production: false,
  dev: true,
  api: '/api',
  socketIOPath: '/api/socket',
  socketIOHost: '',
};
