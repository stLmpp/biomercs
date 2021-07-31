import { baseEnvironment } from '@environment/environment.base';

export const environment = {
  ...baseEnvironment,
  production: false,
  dev: true,
  api: '/api',
  cacheTimeout: 450_000,
  socketIOPath: '/api/socket',
  socketIOHost: '',
};
