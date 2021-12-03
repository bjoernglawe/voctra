import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddCollectionModalModule } from 'src/app/pages/add-collection-modal/add-collection-modal.module';
import { AddVocabModalModule } from 'src/app/pages/add-vocab-modal/add-vocab-modal.module';
import { CreateNewFabModule } from 'src/app/shared/fab/create-new-fab/create-new-fab.module';
import { PopoverCollectionModule } from 'src/app/shared/popover/popover-collection/popover-collection.module';
import { PopoverVocabularyModule } from 'src/app/shared/popover/popover-vocabulary/popover-vocabulary.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { VocabularyPage } from './vocabulary.page';
import { VocabularyPageRoutingModule } from './vocabulary.routes';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: VocabularyPage }]),
    VocabularyPageRoutingModule,
    SharedModule,
    PopoverCollectionModule,
    PopoverVocabularyModule,
    AddVocabModalModule,
    AddCollectionModalModule,
    CreateNewFabModule,
  ],
  declarations: [VocabularyPage]
})
export class VocabularyPageModule { }
