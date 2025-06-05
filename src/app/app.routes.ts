import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'fantasy-characters', pathMatch: 'full' },
  { 
    path: 'fantasy-characters',
    loadChildren: () => import('./characters/character.routes')
      .then(mod => mod.CHARACTER_ROUTES)
  },
  { path: '**', redirectTo: 'fantasy-characters' }
];