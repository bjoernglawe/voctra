import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddVocabModalComponent } from './add-vocab-modal.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [AddVocabModalComponent]
})
export class AddVocabModalModule { }
