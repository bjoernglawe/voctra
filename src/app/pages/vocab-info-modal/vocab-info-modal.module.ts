import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { VocabInfoModalComponent } from './vocab-info-modal.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [VocabInfoModalComponent]
})
export class VocabInfoModalModule { }
