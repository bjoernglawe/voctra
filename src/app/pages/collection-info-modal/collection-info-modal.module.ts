import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CollectionInfoModalComponent } from './collection-info-modal.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [CollectionInfoModalComponent]
})
export class CollectionInfoModalModule { }
