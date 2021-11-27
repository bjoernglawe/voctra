import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { VocabTestPage } from './vocab-test.page';
import { VocabTestPageRoutingModule } from './vocab-test.routes';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    VocabTestPageRoutingModule
  ],
  declarations: [VocabTestPage]
})
export class VocabTestPageModule {}
