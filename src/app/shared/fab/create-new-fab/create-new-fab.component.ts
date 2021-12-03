import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddCollectionModalComponent } from 'src/app/pages/add-collection-modal/add-collection-modal.component';
import { AddVocabModalComponent } from 'src/app/pages/add-vocab-modal/add-vocab-modal.component';

@Component({
  selector: 'create-new-fab',
  templateUrl: './create-new-fab.component.html',
  styleUrls: ['./create-new-fab.component.scss']
})
export class CreateNewFabComponent implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit(): void {
  }

  public async openAddVocabModal() {
    const modal = await this.modalController.create({
      component: AddVocabModalComponent,
    });
    return await modal.present();
  }

  public async openAddCollectionModal() {
    const modal = await this.modalController.create({
      component: AddCollectionModalComponent,
    });
    return await modal.present();
  }
}
