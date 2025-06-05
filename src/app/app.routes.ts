import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { 
    path: 'fantasy-characters',
    loadChildren: () => import('./characters/character.routes')
      .then(mod => mod.CHARACTER_ROUTES)
  },
  { path: '**', redirectTo: 'fantasy-characters' }
];