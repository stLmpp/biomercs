import { baseEnvironment } from '@environment/environment.base';

export const environment = {
  ...baseEnvironment,
  production: true,
  dev: false,
  api: '/api',
  cacheTimeout: 450_000,
  socketIOPath: '/api/socket',
  socketIOHost: '',
  avatar: 'https://biomercs.s3.sa-east-1.amazonaws.com/prod/image/avatar',
};
