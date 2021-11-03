import { baseEnvironment } from '@environment/environment.base';

export const environment = {
  ...baseEnvironment,
  production: false,
  dev: true,
  api: '/api',
  socketIOPath: '/api/socket',
  socketIOHost: '',
  avatar: 'https://biomercs.s3.sa-east-1.amazonaws.com/dev/image/avatar',
};
