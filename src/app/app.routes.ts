import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { 
    path: 'characters',
    loadChildren: () => import('./characters/character.routes')
      .then(mod => mod.CHARACTER_ROUTES)
  },
  { path: '**', redirectTo: 'characters' }
];