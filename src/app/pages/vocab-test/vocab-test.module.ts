import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopoverTestModule } from 'src/app/shared/popover/popover-test/popover-test.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { VocabTestPage } from './vocab-test.page';
import { VocabTestPageRoutingModule } from './vocab-test.routes';

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    SharedModule,
    VocabTestPageRoutingModule,
    ReactiveFormsModule,
    PopoverTestModule,
  ],
  declarations: [VocabTestPage]
})
export class VocabTestPageModule {}
