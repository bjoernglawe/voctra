import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'vocab-test',
    loadChildren: () => import('./pages/vocab-test/vocab-test.module').then(m => m.VocabTestPageModule)
  },
  {
    path: 'add-vocab',
    loadChildren: () => import('./pages/add-vocab/add-vocab.module').then(m => m.AddVocabPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
