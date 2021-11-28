import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared.module';
import { PopoverVocabularyComponent } from './popover-vocabulary.component';


@NgModule({
  declarations: [PopoverVocabularyComponent],
  imports: [
    IonicModule,
    SharedModule,
  ]
})
export class PopoverVocabularyModule { }
