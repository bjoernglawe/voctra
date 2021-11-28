import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'add-vocab-page',
  templateUrl: 'add-vocab.page.html',
  styleUrls: ['add-vocab.page.scss']
})
export class AddVocabPage {
  private ngUnsubscribe: Subject<void> = new Subject();

  public vocabCollections: E_VocabCollection[] = [];

  public vocabFormGroup: FormGroup = new FormGroup({
    collection: new FormControl(undefined, [Validators.required]),
    collTitle: new FormControl(undefined, [Validators.required]),
    collLanguage: new FormControl(undefined, [Validators.required]),
    collTranslateLang: new FormControl(undefined, [Validators.required]),
    collDescription: new FormControl(),
    collColor: new FormControl(),

    vocWord: new FormControl(undefined, [Validators.required]),
    vocPron: new FormControl(),
    vocTrans: new FormControl(undefined, [Validators.required]),
    vocDesc: new FormControl(),
  })

  constructor(
    private vocabService: VocabManagerService,
  ) {
    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((collections: E_VocabCollection[]) => {
        this.vocabCollections = collections;
        if (!this.vocabFormGroup.get('collection').value || this.vocabFormGroup.get('collection').value == 'new') {
          if (collections.length <= 0) {
            this.vocabFormGroup.get('collection').setValue("new");
          } else {
            this.vocabFormGroup.get('collection').setValue(collections[collections.length - 1].id);
          }
        }
      })
    this.vocabService.loadVocabulary();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public saveNewCollection() {
    if (this.vocabFormGroup.get('collection').value != 'new') {
      return;
    }
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

    this.vocabFormGroup.get('collTitle').setValue(undefined);
    this.vocabFormGroup.get('collLanguage').setValue(undefined);
    this.vocabFormGroup.get('collTranslateLang').setValue(undefined);
    this.vocabFormGroup.get('collDescription').setValue(undefined);
    this.vocabFormGroup.get('collColor').setValue(undefined);
  }

  public saveNewVocCard() {
    if (this.vocabFormGroup.get('collection').value == 'new') {
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

    this.vocabFormGroup.get('vocWord').setValue(undefined);
    this.vocabFormGroup.get('vocTrans').setValue(undefined);
    this.vocabFormGroup.get('vocPron').setValue(undefined);
    this.vocabFormGroup.get('vocDesc').setValue(undefined);
  }
}
