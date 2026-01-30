import { Routes } from '@angular/router';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { GoogleCallbackComponent } from './google-callback/google-callback.component';

export const routes: Routes = [
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'callback', component: GoogleCallbackComponent }
];
