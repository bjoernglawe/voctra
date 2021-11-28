import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverCollectionModule } from 'src/app/shared/popover-collection/popover-collection.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddVocabPage } from './add-vocab.page';
import { AddVocabPageRoutingModule } from './add-vocab.routes';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    AddVocabPageRoutingModule,
    ReactiveFormsModule,
    PopoverCollectionModule,
  ],
  declarations: [AddVocabPage]
})
export class AddVocabPageModule {}
