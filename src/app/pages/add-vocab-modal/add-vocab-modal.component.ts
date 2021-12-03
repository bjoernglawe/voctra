import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: "add-vocab-modal",
  templateUrl: './add-vocab-modal.component.html',
  styleUrls: ['./add-vocab-modal.component.scss']
})
export class AddVocabModalComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject();

  public collectionMissing: boolean = false;
  public vocabCollections: E_VocabCollection[] = [];

  public vocabFormGroup: FormGroup = new FormGroup({
    collection: new FormControl(undefined, [Validators.required]),
    vocWord: new FormControl(undefined, [Validators.required]),
    vocPron: new FormControl(),
    vocTrans: new FormControl(undefined, [Validators.required]),
    vocDesc: new FormControl(),
  })

  constructor(
    private vocabService: VocabManagerService,
    private modalController: ModalController,
    private toastController: ToastController,
    private translateService: TranslateService,
  ) {
    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((collections: E_VocabCollection[]) => {
        this.vocabCollections = collections;
        if (!this.vocabFormGroup.get('collection').value) {
          if (collections.length > 0) {
            this.vocabFormGroup.get('collection').setValue(collections[collections.length - 1].id);
          } else {
            this.collectionMissing = true;
          }
        }
      })
    this.vocabService.loadVocabulary();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  public saveNewVocCard() {
    if (!this.vocabFormGroup.get('collection').value) {
      return;
    }
    if (
      this.vocabFormGroup.get('vocWord').invalid ||
      this.vocabFormGroup.get('vocTrans').invalid
    ) {
      return;
    }
    const collection = this.vocabFormGroup.get('collection').value;
    const vocWord = this.vocabFormGroup.get('vocWord').value;
    const vocTrans = this.vocabFormGroup.get('vocTrans').value;
    const vocPron = this.vocabFormGroup.get('vocPron').value;
    const vocDesc = this.vocabFormGroup.get('vocDesc').value;

    this.vocabService.createVocabCard(collection, vocWord, vocTrans, vocPron, vocDesc);
    this.toastSave(vocWord, vocTrans);

    this.vocabFormGroup.get('vocWord').setValue(undefined);
    this.vocabFormGroup.get('vocTrans').setValue(undefined);
    this.vocabFormGroup.get('vocPron').setValue(undefined);
    this.vocabFormGroup.get('vocDesc').setValue(undefined);
  }

  private async toastSave(word: string, translation: string) {
    const toast = await this.toastController.create({
      header: this.translateService.instant('SAVE_VOCABULARY'),
      message: word + ' - ' + translation,
      color: 'success',
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
}
