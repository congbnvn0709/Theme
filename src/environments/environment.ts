// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v01bankGateway',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: false,
  apiUrl: 'http://123.31.20.76:8080/gateway-server-1.0-plain', // dev
  // apiUrl: 'http://localhost:8080/v1/api',
  defaultLanguage: 'vi',
  siteKey: '6LfhzDscAAAAABgJweEE_WN5e6ZgtfQZGqYiQJPW'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
