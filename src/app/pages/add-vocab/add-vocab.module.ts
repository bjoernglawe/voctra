import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddVocabPageRoutingModule } from './add-vocab.routes';
import { AddVocabPage } from './add-vocab.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    SharedModule,
    AddVocabPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddVocabPage]
})
export class AddVocabPageModule {}
