import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { CollectionSelectorModalComponent } from './collection-selector-modal.component';



@NgModule({
  declarations: [
    CollectionSelectorModalComponent
  ],
  exports: [
    CollectionSelectorModalComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
  ]
})
export class CollectionSelectorModalModule { }
