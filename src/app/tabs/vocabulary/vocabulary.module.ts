import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VocabularyPage } from './vocabulary.page';

import { VocabularyPageRoutingModule } from './vocabulary-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: VocabularyPage }]),
    VocabularyPageRoutingModule,
    TranslateModule.forRoot(),
  ],
  declarations: [VocabularyPage]
})
export class VocabularyPageModule {}
