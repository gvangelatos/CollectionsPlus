import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'collections',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./pages/collections/collections.module').then(
        (m) => m.CollectionsPageModule
      ),
  },
  {
    path: 'collection/:collectionId',
    loadChildren: () =>
      import('./pages/collection/collection.module').then(
        (m) => m.CollectionPageModule
      ),
  },
  {
    path: 'new-collection',
    loadChildren: () =>
      import('./pages/new-collection/new-collection.module').then(
        (m) => m.NewCollectionPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
