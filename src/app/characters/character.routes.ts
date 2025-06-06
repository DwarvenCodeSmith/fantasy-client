import { Routes } from '@angular/router';

export const CHARACTER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./character-list/character-list.component')
      .then(m => m.CharacterListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./character-form/character-form.component')
      .then(m => m.CharacterFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./character-detail/character-detail.component')
      .then(m => m.CharacterDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./character-form/character-form.component')
      .then(m => m.CharacterFormComponent)
  }
];