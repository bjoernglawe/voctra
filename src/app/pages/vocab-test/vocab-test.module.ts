import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VocabTestPageRoutingModule } from './vocab-test-routing.module';
import { VocabTestPage } from './vocab-test.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    VocabTestPageRoutingModule
  ],
  declarations: [VocabTestPage]
})
export class VocabTestPageModule {}
