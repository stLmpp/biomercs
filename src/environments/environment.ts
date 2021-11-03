// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { baseEnvironment } from '@environment/environment.base';

export const environment = {
  ...baseEnvironment,
  production: false,
  api: '/api',
  dev: true,
  socketIOPath: '/api/socket',
  socketIOHost: 'http://localhost:3000',
  avatar: 'https://biomercs.s3.sa-east-1.amazonaws.com/dev/image/avatar',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
