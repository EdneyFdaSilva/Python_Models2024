// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appTitle: 'Mfg Ops DigitalSC',
  appVersion: '4.3.8',
  urlBackend: 'http://localhost:5000/api/',
  // urlBackendDvc: 'http://mfgopsdigitalsc.com.br:8080/api/',
  urlBackendDvc: 'https://localhost:44309/api/',
  urlLegacyApi: 'https://187.86.215.40/backend/api/',
  urlWazi: 'http://201.48.5.193:8060/wazi/',
  filterFormDebounce: 1000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
