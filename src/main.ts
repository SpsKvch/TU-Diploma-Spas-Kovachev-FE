import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApprootComponent } from './app/approot/approot.component';

bootstrapApplication(ApprootComponent, appConfig)
  .catch((err) => console.error(err));
//platformBrowserDynamic().bootstrapModule(HomepageComponent);
