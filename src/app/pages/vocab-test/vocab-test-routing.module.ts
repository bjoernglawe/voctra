import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VocabTestPage } from './vocab-test.page';

const routes: Routes = [
  {
    path: '',
    component: VocabTestPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VocabTestPageRoutingModule {}
