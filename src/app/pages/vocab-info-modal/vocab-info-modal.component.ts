import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'vocab-info-modal',
  templateUrl: './vocab-info-modal.component.html',
  styleUrls: ['./vocab-info-modal.component.scss']
})
export class VocabInfoModalComponent implements OnInit {

  @Input('vocab') vocab: E_VocabCard = undefined;
  @Input('collection') collection: E_VocabCollection = undefined;

  public editMode: boolean = false;

  public vocabFormGroup: FormGroup = new FormGroup({
    vocWord: new FormControl(this.vocab?.word, [Validators.required]),
    vocPron: new FormControl(this.vocab?.pronunciation),
    vocTrans: new FormControl(this.vocab?.translation, [Validators.required]),
    vocDesc: new FormControl(this.vocab?.description),
  })

  constructor(
    private modalController: ModalController,
    private vocabService: VocabManagerService,
    private toastController: ToastController,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  public editVocab() {
    this.vocabFormGroup.get('vocWord').setValue(this.vocab.word);
    this.vocabFormGroup.get('vocPron').setValue(this.vocab.pronunciation);
    this.vocabFormGroup.get('vocTrans').setValue(this.vocab.translation);
    this.vocabFormGroup.get('vocDesc').setValue(this.vocab.description);
    this.editMode = true;
  }

  public saveChanges() {
    if (
      this.vocabFormGroup.get('vocWord').invalid ||
      this.vocabFormGroup.get('vocTrans').invalid
    ) {
      return;
    }

    this.vocab.word = this.vocabFormGroup.get('vocWord').value;
    this.vocab.translation = this.vocabFormGroup.get('vocTrans').value;
    this.vocab.pronunciation = this.vocabFormGroup.get('vocPron').value;
    this.vocab.description = this.vocabFormGroup.get('vocDesc').value;

    this.vocabService.saveVocabulary();
    this.editMode = false;
    this.toastSave(this.vocab.word, this.vocab.translation);
  }

  private async toastSave(word: string, translation: string) {
    const toast = await this.toastController.create({
      header: this.translateService.instant('SAVED_CHANGES'),
      message: word + ' - ' + translation,
      color: 'success',
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
}
