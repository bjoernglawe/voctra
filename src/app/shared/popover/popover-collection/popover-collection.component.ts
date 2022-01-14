import { Component, Input, OnInit } from '@angular/core';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Capacitor } from '@capacitor/core';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';
import { CollectionInfoModalComponent } from 'src/app/pages/collection-info-modal/collection-info-modal.component';
import { E_VocabCollection } from 'src/models/vocabulary.model';

@Component({
  selector: 'popover-collection',
  templateUrl: './popover-collection.component.html',
  styleUrls: ['./popover-collection.component.scss']
})
export class PopoverCollectionComponent implements OnInit {

  @Input() collection: E_VocabCollection = undefined;

  constructor(
    private popover: PopoverController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

  ngOnInit(): void {
  }

  ClosePopover() {
    this.popover.dismiss();
  }

  public deleteCollection() {
    this.popover.dismiss("delete");
  }

  public async editCollection() {
    if (this.collection) {
      const modal = await this.modalController.create({
        component: CollectionInfoModalComponent,
        componentProps: {
          collection: this.collection,
        }
      });
      return await modal.present();
    }
  }

  public async downloadCollection() {

    let fileName = (this.validFilename(this.collection.title) ? this.collection.title.replace(/\s+/g, '_') : 'data') + '.json';
    let jsonContent = JSON.stringify(this.collection);

    if (Capacitor.getPlatform() == 'android') {
      const dataBase64 = btoa(unescape(encodeURIComponent(jsonContent)));

      FileSharer.share({
        filename: fileName,
        base64Data: dataBase64,
        contentType: 'application/json'
      }).then(() => {
        this.popover.dismiss();
      }).catch(async error => {
        if (error) {
          const toast = await this.toastController.create({
            message: 'Export failed!' + JSON.stringify(error),
            color: 'danger',
            duration: 2000,
          });
          toast.present();
        }
      });
    } else if (Capacitor.getPlatform() == 'web') {
      var blob = new Blob([jsonContent]);
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.popover.dismiss();
    } else {
      const toast = await this.toastController.create({
        message: 'Export failed! (No export option on your device defined)',
        color: 'danger',
        duration: 2000
      });
      toast.present();
    }
  }

  private validFilename(filename: string): boolean {
    return /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/i.test(filename)
  }
}
