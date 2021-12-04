import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateNewFabModule } from 'src/app/shared/fab/create-new-fab/create-new-fab.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OverviewPage } from './overview.page';
import { OverviewPageRoutingModule } from './overview.routes';


@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    OverviewPageRoutingModule,
    CreateNewFabModule,
  ],
  declarations: [OverviewPage]
})
export class Tab1PageModule { }
