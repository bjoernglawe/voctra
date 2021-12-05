import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';

@Component({
  selector: 'vocab-info-modal',
  templateUrl: './vocab-info-modal.component.html',
  styleUrls: ['./vocab-info-modal.component.scss']
})
export class VocabInfoModalComponent implements OnInit {

  @Input('vocab') vocab: E_VocabCard = undefined;
  @Input('collection') collection: E_VocabCollection = undefined;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalController.dismiss();
  }
}
