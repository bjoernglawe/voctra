import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateNewFabComponent } from './create-new-fab.component';
import { SharedModule } from '../../shared.module';



@NgModule({
  declarations: [
    CreateNewFabComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    CreateNewFabComponent
  ]
})
export class CreateNewFabModule { }
