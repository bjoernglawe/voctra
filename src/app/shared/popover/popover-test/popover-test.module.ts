import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverTestComponent } from './popover-test.component';
import { SharedModule } from '../../shared.module';



@NgModule({
  declarations: [
    PopoverTestComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class PopoverTestModule { }
