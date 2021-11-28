import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { PopoverVocabularyComponent } from './popover-vocabulary/popover-vocabulary.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
  ],
  exports: [
    CommonModule,
    TranslateModule,
    IonicModule,
  ]
})
export class SharedModule { }
