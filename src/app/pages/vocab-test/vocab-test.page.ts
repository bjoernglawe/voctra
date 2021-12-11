import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CollectionSelectorModalComponent } from 'src/app/shared/modal/collection-selector-modal/collection-selector-modal.component';
import { PopoverTestComponent } from 'src/app/shared/popover/popover-test/popover-test.component';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'vocab-test-page',
  templateUrl: 'vocab-test.page.html',
  styleUrls: ['vocab-test.page.scss']
})
export class VocabTestPage {

  private ngUnsubscribe: Subject<void> = new Subject();

  public vocabulary: E_VocabCollection[] = [];
  public selectedVocabulary: E_VocabCollection[] = [];
  public vocabCards: E_VocabCard[] = [];
  public currentCard: E_VocabCard;

  public showSuccess: boolean = false;
  public showWrong: boolean = false;

  @ViewChild('vocWord') vocWord;
  @ViewChild('vocTrans') vocTrans;

  public settings: {
    showPron: boolean,
    showDesc: boolean,
    order: boolean,
    rowSize: number,
  } = {
      showPron: false,
      showDesc: false,
      order: true,       // true: Word (disabled) -> Translation (input)
      rowSize: 10,
    }

  public testFormGroup = new FormGroup({
    vocWord: new FormControl(),
    vocPron: new FormControl(),
    vocTrans: new FormControl(),
    vocDesc: new FormControl(),
  });

  constructor(
    private vocabService: VocabManagerService,
    private popoverController: PopoverController,
    private platform: Platform,
    private navCtrl: NavController,
    private modalController: ModalController,
  ) {
    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.vocabulary = res;
        if (this.selectedVocabulary.length <= 0) {
          this.selectedVocabulary = this.vocabulary;
        }
        this.initVocabCards();
      });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.back()
    });
  }

  ngOnInit() {
    this.vocabService.loadVocabulary();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public initVocabCards(): void {
    this.vocabCards = [];
    this.selectedVocabulary.forEach(collection => {
      this.vocabCards = this.vocabCards.concat(collection.vocabulary);
    });
    console.log(this.vocabCards);
  }

  public selectNextCard() {
    this.showSuccess = false;
    this.showWrong = false;
    const max = this.vocabCards.length;
    const ranIndex = Math.round(Math.random() * (max - 1));
    this.currentCard = this.vocabCards[ranIndex];
    this.setCardContent();
  }

  public async presentTestPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverTestComponent,
      cssClass: '',
      event: ev,
      showBackdrop: true,
      translucent: true,
      keyboardClose: true,
      componentProps: { settings: this.settings },
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
  }

  private setCardContent() {
    if (!this.currentCard) {
      return;
    }
    this.testFormGroup.get('vocPron').setValue(this.currentCard.pronunciation);
    this.testFormGroup.get('vocDesc').setValue(this.currentCard.description);
    if (this.settings.order) {
      this.testFormGroup.get('vocWord').setValue(this.currentCard.word);
      this.testFormGroup.get('vocWord').disable();
      this.testFormGroup.get('vocTrans').setValue(null);
      this.testFormGroup.get('vocTrans').enable();
      setTimeout(() => {
        this.vocTrans.setFocus();
      }, 50)
    } else {
      this.testFormGroup.get('vocWord').setValue(null);
      this.testFormGroup.get('vocWord').enable();
      this.testFormGroup.get('vocTrans').setValue(this.currentCard.translation);
      this.testFormGroup.get('vocTrans').disable();
      setTimeout(() => {
        this.vocWord.setFocus();
      }, 50)
    }
  }

  private rowCounterAdd(counter: number): number {
    if (counter < this.settings.rowSize) {
      return (counter += 1);
    }
    return counter;
  }

  private rowCounterRemove(counter: number): number {
    if (counter > 0) {
      return (counter -= 1);
    }
    return counter;
  }

  public checkTest() {
    // this.testFormGroup.get('vocWord').disable();
    // this.testFormGroup.get('vocTrans').disable();
    if (this.settings.order) { // TRANSLATION CHECK
      if (this.testFormGroup.get('vocTrans').value &&
        (this.testFormGroup.get('vocTrans').value as string).toLowerCase() == this.currentCard.translation.toLowerCase()) {
        this.currentCard.transCorrect++;
        this.currentCard.transCorrectRow = this.rowCounterAdd(this.currentCard.transCorrectRow);
        this.showSuccess = true;
      } else {
        this.currentCard.transWrong++;
        this.currentCard.transCorrectRow = this.rowCounterRemove(this.currentCard.transCorrectRow);
        this.showWrong = true;
      }
    } else {  // WORD CHECK
      if (this.testFormGroup.get('vocWord').value &&
        (this.testFormGroup.get('vocWord').value as string).toLowerCase() == this.currentCard.word.toLowerCase()) {
        this.currentCard.wordCorrect++;
        this.currentCard.wordCorrectRow = this.rowCounterAdd(this.currentCard.wordCorrectRow);
        this.showSuccess = true;
      } else {
        this.currentCard.wordWrong++;
        this.currentCard.wordCorrectRow = this.rowCounterRemove(this.currentCard.wordCorrectRow);
        this.showWrong = true;
      }
    }
    // SAVE & NEXT
    this.vocabService.saveVocabulary();
    if (this.showSuccess) {
      setTimeout(() => {
        this.selectNextCard();
      }, 1500)
    }
  }

  public changeOrder() {
    this.settings.order = !this.settings.order;
    this.setCardContent();
  }

  public getCardLanguage(vocabCard: E_VocabCard): string {
    if (!vocabCard) {
      return ''
    }
    return this.vocabulary.find(coll => coll.id == vocabCard.collectionId).language;
  }

  public getCardTransLanguage(vocabCard: E_VocabCard): string {
    if (!vocabCard) {
      return ''
    }
    return this.vocabulary.find(coll => coll.id == vocabCard.collectionId).translateLang;
  }

  public getArrayOfCorrect(rowCounter: number): Array<any> {
    return Array(rowCounter);
  }

  public enterKeyPressed() {
    if (!this.currentCard || this.showWrong) {
      this.selectNextCard();
    } else {
      this.checkTest();
    }
  }

  public async presentCollectionModal(event: Event) {
    let vocabWithSelect: (E_VocabCollection & { selected?: boolean })[] = this.vocabulary;
    vocabWithSelect.forEach(coll => {
      coll.selected = this.selectedVocabulary.find(selColl => selColl.id == coll.id) != undefined;
    });
    const modal = await this.modalController.create({
      component: CollectionSelectorModalComponent,
      animated: true,
      cssClass: 'small-modal',
      backdropDismiss: true,
      componentProps: {
        allVocabulary: vocabWithSelect,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.saved) {
      this.selectedVocabulary = [];
      data.selectedVocabulary.forEach(selColl => {
        if (selColl.selected) {
          this.selectedVocabulary.push(this.vocabulary.find(coll => coll.id == selColl.id));
        }
      })
      this.initVocabCards();
    }
  }
}
