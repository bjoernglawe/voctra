import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { E_VocabCollection } from 'src/models/vocabulary.model';

@Component({
  selector: 'collection-selector-modal',
  templateUrl: './collection-selector-modal.component.html',
  styleUrls: ['./collection-selector-modal.component.scss']
})
export class CollectionSelectorModalComponent implements OnInit {

  @Input('allVocabulary') allVocabulary: (E_VocabCollection & {selected?: boolean})[] = [];

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit(): void {
  }

  public dismissModal(): void {
    this.modalController.dismiss({
      'selectedVocabulary': this.allVocabulary,
      'saved': true,
    });
  }
}
