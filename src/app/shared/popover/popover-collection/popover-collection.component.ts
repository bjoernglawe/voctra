import { Component, Input, OnInit } from '@angular/core';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { Capacitor } from '@capacitor/core';
import { PopoverController } from '@ionic/angular';
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
  ) {  }

  ngOnInit(): void {
  }

  ClosePopover() {
    this.popover.dismiss();
  }

  public deleteCollection() {
    this.popover.dismiss("delete");
  }

  public downloadCollection() {

    let fileName = this.validFilename(this.collection.title) ? this.collection.title.replace(/\s+/g, '_') : 'data' + '.json';
    let jsonContent = JSON.stringify(this.collection);

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

  private validFilename(filename: string): boolean {
    return /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/i.test(filename)
  }
}
