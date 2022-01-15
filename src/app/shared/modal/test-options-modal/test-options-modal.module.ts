import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { TestOptionsModalComponent } from './test-options-modal.component';



@NgModule({
  declarations: [
    TestOptionsModalComponent
  ],
  exports: [
    TestOptionsModalComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
  ]
})
export class TestOptionsModalModule { }
