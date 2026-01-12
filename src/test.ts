// Test entry for Karma. Use zone.js/testing and import.meta.glob to load specs
// Test entry for Karma. Use zone.js/testing and require.context to load specs
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Find all the tests.
declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
