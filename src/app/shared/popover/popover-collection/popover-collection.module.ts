import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CollectionInfoModalModule } from 'src/app/pages/collection-info-modal/collection-info-modal.module';
import { SharedModule } from '../../shared.module';
import { PopoverCollectionComponent } from './popover-collection.component';


@NgModule({
  imports: [
    IonicModule,
    SharedModule,
    CollectionInfoModalModule,
  ],
  declarations: [
    PopoverCollectionComponent
  ],
})
export class PopoverCollectionModule { }
