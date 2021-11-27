import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVocabPage } from './add-vocab.page';

const routes: Routes = [
  {
    path: '',
    component: AddVocabPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddVocabPageRoutingModule {}
