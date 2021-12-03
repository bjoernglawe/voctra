import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared.module';
import { PopoverCollectionComponent } from './popover-collection.component';


@NgModule({
  imports: [
    IonicModule,
    SharedModule,
  ],
  declarations: [
    PopoverCollectionComponent
  ],
})
export class PopoverCollectionModule { }
