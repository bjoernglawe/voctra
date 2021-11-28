import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PopoverCollectionModule } from 'src/app/shared/popover-collection/popover-collection.module';
import { PopoverVocabularyModule } from 'src/app/shared/popover-vocabulary/popover-vocabulary.module';
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
  ],
  declarations: [VocabularyPage]
})
export class VocabularyPageModule { }
