import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCollectionModalComponent } from './add-collection-modal.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [AddCollectionModalComponent]
})
export class AddCollectionModalModule { }
