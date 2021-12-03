import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'add-collection-modal',
  templateUrl: './add-collection-modal.component.html',
  styleUrls: ['./add-collection-modal.component.scss']
})
export class AddCollectionModalComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject();

  public vocabCollections: E_VocabCollection[] = [];

  public vocabFormGroup: FormGroup = new FormGroup({
    collTitle: new FormControl(undefined, [Validators.required]),
    collLanguage: new FormControl(undefined, [Validators.required]),
    collTranslateLang: new FormControl(undefined, [Validators.required]),
    collDescription: new FormControl(),
    collColor: new FormControl(),
  })

  constructor(
    private vocabService: VocabManagerService,
    private modalController: ModalController,
    private translateService: TranslateService,
    private toastController: ToastController,
  ) {
    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((collections: E_VocabCollection[]) => {
        this.vocabCollections = collections;
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

  public saveNewCollection() {
    if (
      this.vocabFormGroup.get('collTitle').invalid ||
      this.vocabFormGroup.get('collLanguage').invalid ||
      this.vocabFormGroup.get('collTranslateLang').invalid
    ) {
      return;
    }
    const collTitle = this.vocabFormGroup.get('collTitle').value;
    const collLanguage = this.vocabFormGroup.get('collLanguage').value;
    const collTranslateLang = this.vocabFormGroup.get('collTranslateLang').value;
    const collDescription = this.vocabFormGroup.get('collDescription').value;
    const collColor = this.vocabFormGroup.get('collColor').value;

    this.vocabService.createVocabCollection(collTitle, collLanguage, collTranslateLang, collDescription, collColor);
    this.toastSave(collTitle, collLanguage, collTranslateLang);

    this.closeModal();
  }
  
  private toastSave(collTitle: string, language: string, transLanguage: string) {
    this.translateService.get('SAVE_COLLECTION').subscribe(
      async value => {
        let title = value;

        const toast = await this.toastController.create({
          header: title,
          message: collTitle + ' (' + language + ' - ' + transLanguage + ')',
          color: 'success',
          position: 'bottom',
          duration: 2000,
        });
        toast.present();
      }
    )
  }
}
