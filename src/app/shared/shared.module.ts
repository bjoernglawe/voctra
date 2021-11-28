import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
  ],
  exports: [
    CommonModule,
    TranslateModule,
    IonicModule,
  ]
})
export class SharedModule { }
