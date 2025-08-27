import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

// Header Color 17001A
// Side Bar Color 1A001A -> 3D0066
// Table Color 3D0066 -> 1E0032
// Shine Color - Button Color  D100D1   