import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'breeds', loadComponent: () => import('./features/breeds/breeds.component').then(m => m.BreedsComponent) },
  { path: 'favorites', loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent) },
  { path: 'upload', loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent) }
];
