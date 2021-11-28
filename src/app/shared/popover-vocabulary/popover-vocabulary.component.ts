import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'popover-vocabulary',
  templateUrl: './popover-vocabulary.component.html',
  styleUrls: ['./popover-vocabulary.component.scss']
})
export class PopoverVocabularyComponent implements OnInit {

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
        let collection: E_VocabCollection = JSON.parse(evt.target.result as string);
        if (collection.id && collection.title && collection.language && collection.date && collection.translateLang && collection.vocabulary) {
          this.vocabService.addCollection(collection);
          this.popover.dismiss();
        }
      }
    }
  }

}
