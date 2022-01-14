import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'collection-info-modal',
  templateUrl: './collection-info-modal.component.html',
  styleUrls: ['./collection-info-modal.component.scss']
})
export class CollectionInfoModalComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject();

  @Input('collection') collection: E_VocabCollection = undefined;

  public editMode: boolean = false;

  public vocabFormGroup: FormGroup = new FormGroup({
    collTitle: new FormControl(undefined, [Validators.required]),
    collLanguage: new FormControl(undefined, [Validators.required]),
    collTranslateLang: new FormControl(undefined, [Validators.required]),
    collDescription: new FormControl(),
    collColor: new FormControl(),
  })

  constructor(
    private modalController: ModalController,
    private vocabService: VocabManagerService,
    private toastController: ToastController,
    private translateService: TranslateService
  ) {
    vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((collections: E_VocabCollection[]) => {
        this.collection = collections.find(coll => coll.id == this.collection.id);
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  public editVocab() {
    this.vocabFormGroup.get('collTitle').setValue(this.collection.title);
    this.vocabFormGroup.get('collLanguage').setValue(this.collection.language);
    this.vocabFormGroup.get('collTranslateLang').setValue(this.collection.translateLang);
    this.vocabFormGroup.get('collDescription').setValue(this.collection.description);
    this.vocabFormGroup.get('collColor').setValue(this.collection.color);
    this.editMode = true;
  }

  public saveChanges() {
    if (
      this.vocabFormGroup.get('collTitle').invalid ||
      this.vocabFormGroup.get('collLanguage').invalid ||
      this.vocabFormGroup.get('collTranslateLang').invalid
    ) {
      return;
    }

    this.collection.title = this.vocabFormGroup.get('collTitle').value;
    this.collection.language = this.vocabFormGroup.get('collLanguage').value;
    this.collection.translateLang = this.vocabFormGroup.get('collTranslateLang').value;
    this.collection.description = this.vocabFormGroup.get('collDescription').value;
    this.collection.color = this.vocabFormGroup.get('collColor').value;

    this.vocabService.saveVocabulary();
    this.editMode = false;
    this.toastSave(this.collection.title, this.collection.language);
  }

  private async toastSave(title: string, language: string) {
    const toast = await this.toastController.create({
      header: this.translateService.instant('SAVED_CHANGES'),
      message: title + ' - ' + language,
      color: 'success',
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
}
