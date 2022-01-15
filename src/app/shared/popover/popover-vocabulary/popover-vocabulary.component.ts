import { Component, Input, OnInit } from '@angular/core';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Capacitor } from '@capacitor/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'popover-vocabulary',
  templateUrl: './popover-vocabulary.component.html',
  styleUrls: ['./popover-vocabulary.component.scss']
})
export class PopoverVocabularyComponent implements OnInit {

  @Input() collections: E_VocabCollection[] = undefined;

  constructor(
    private popover: PopoverController,
    private vocabService: VocabManagerService,
    private toastController: ToastController,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  public uploadCollection(ev: any) {
    let file = ev.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        let json = JSON.parse(evt.target.result as string);
        if (Object.prototype.toString.call(json) === '[object Array]') {
          console.log('All Data');
          let collections: E_VocabCollection[] = json;
          collections.forEach(coll => {
            if (coll.id && coll.title && coll.language && coll.date && coll.translateLang && coll.vocabulary) {
              this.vocabService.addCollection(coll);
            }
          });
          this.toastController.create({
            message: this.translateService.instant('ADD_VOCABULARY'),
            color: 'success',
            duration: 2000,
          }).then((toast) => {
            toast.present();
          });
          this.vocabService.loadVocabulary();
          this.popover.dismiss()
        }
        if (json.id) {
          console.log('is one Collection');
          let collection: E_VocabCollection = json;
          if (collection.id && collection.title && collection.language && collection.date && collection.translateLang && collection.vocabulary) {
            this.vocabService.addCollection(collection);
            this.toastController.create({
              message: this.translateService.instant('ADD_VOCABULARY'),
              color: 'success',
              duration: 2000,
            }).then((toast) => {
              toast.present();
            });
            this.vocabService.loadVocabulary();
            this.popover.dismiss();
          }
        }
      }
    }
  }


  public async downloadAll() {

    let fileName = 'voctraData.json';
    let jsonContent = JSON.stringify(this.collections);

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
}
