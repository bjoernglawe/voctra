import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { OverviewPage } from './overview.page';
import { OverviewPageRoutingModule } from './overview.routes';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OverviewPageRoutingModule,
    SharedModule,
  ],
  declarations: [OverviewPage]
})
export class Tab1PageModule { }
