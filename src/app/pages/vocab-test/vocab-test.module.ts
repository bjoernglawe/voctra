import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CollectionSelectorModalModule } from 'src/app/shared/modal/collection-selector-modal/collection-selector-modal.module';
import { TestOptionsModalModule } from 'src/app/shared/modal/test-options-modal/test-options-modal.module';
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
    CollectionSelectorModalModule,
    TestOptionsModalModule,
  ],
  declarations: [VocabTestPage]
})
export class VocabTestPageModule {}
