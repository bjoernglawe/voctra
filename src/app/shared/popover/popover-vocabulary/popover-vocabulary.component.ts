import { Component, Input, OnInit } from '@angular/core';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Capacitor } from '@capacitor/core';
import { PopoverController } from '@ionic/angular';
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
  ) { }

  ngOnInit(): void {
  }

  ClosePopover() {
    this.popover.dismiss();
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
          this.popover.dismiss()
        }
        if (json.id) {
          console.log('is one Collection');
          let collection: E_VocabCollection = json;
          if (collection.id && collection.title && collection.language && collection.date && collection.translateLang && collection.vocabulary) {
            this.vocabService.addCollection(collection);
            this.popover.dismiss();
          }
        }
      }
    }
  }


  public downloadAll() {

    let fileName = 'voctra-data.json';
    let jsonContent = JSON.stringify(this.collections);

    if (Capacitor.getPlatform() == 'android') {
      FileSharer.share({
        filename: fileName,
        base64Data: btoa(jsonContent),
        contentType: 'application/json'
      }).then(() => {
        this.popover.dismiss();
      }).catch(error => {
        console.error("File sharing failed", JSON.stringify(error));
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
    }
  }
}
