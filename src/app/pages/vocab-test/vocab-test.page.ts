import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CollectionSelectorModalComponent } from 'src/app/shared/modal/collection-selector-modal/collection-selector-modal.component';
import { TestOptionsModalComponent } from 'src/app/shared/modal/test-options-modal/test-options-modal.component';
import { PopoverTestComponent } from 'src/app/shared/popover/popover-test/popover-test.component';
import { E_TestOptions } from 'src/models/test-options.model';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';
import { TestOptionsService } from 'src/services/test-options.service';
import { VocabManagerService } from 'src/services/vocab-manager.service';

/**
 * card initialization
 * function order:
 *  1. filterSelectedCollections()
 *  2. initVocabCards()
 *  3. selectNextCard()
 */

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

  // cache
  private removableBeforeWasZero: boolean = false;

  public options: E_TestOptions = new E_TestOptions();

  public testFormGroup = new FormGroup({
    vocWord: new FormControl(),
    vocPron: new FormControl(),
    vocTrans: new FormControl(),
    vocDesc: new FormControl(),
  });

  constructor(
    private vocabService: VocabManagerService,
    private platform: Platform,
    private navCtrl: NavController,
    private modalController: ModalController,
    private optionsService: TestOptionsService,
  ) {
    this.optionsService.getOptions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: E_TestOptions) => {
        this.options = res;
        this.filterSelectedCollections();
      });

    // vocabulary updates
    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: E_VocabCollection[]) => {
        this.vocabulary = res;
        this.filterSelectedCollections();
      });

    // back button navigation
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.back()
    });
  }

  ngOnInit() {
    this.optionsService.loadOptions();
    this.vocabService.loadVocabulary();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * set selected Collections
   */
  private filterSelectedCollections() {
    this.selectedVocabulary = [];
    this.vocabulary.forEach(coll => {
      if (!this.options.selectedCollIds.find(id => id == coll.id)) {
        this.selectedVocabulary.push(coll);
      }
    })
    this.initVocabCards();
  }

  /**
   * vocabulary collections to big set of cards
   */
  private initVocabCards(): void {
    this.vocabCards = [];
    this.selectedVocabulary.forEach(collection => {
      this.vocabCards = this.vocabCards.concat(collection.vocabulary);
    });
    // set new Card if old card for test is ready (but with old reference)
    if (!this.showSuccess && !this.showWrong && this.currentCard) {
      this.selectNextCard();
    }
  }

  /**
   * select random new card
   */
  public selectNextCard() {
    this.showSuccess = false;
    this.showWrong = false;
    const max = this.vocabCards.length;
    const ranIndex = Math.round(Math.random() * (max - 1));
    this.currentCard = this.vocabCards[ranIndex];
    this.setCardContent();
  }

  /**
   * initialize test with new vocab
   * sets input fields
   */
  private setCardContent() {
    if (!this.currentCard) {
      return;
    }
    this.testFormGroup.get('vocPron').setValue(this.currentCard.pronunciation);
    this.testFormGroup.get('vocDesc').setValue(this.currentCard.description);
    if (this.options.order) {
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

  /**
   * increases counter, only when lower than max rowSize
   * @param {number} counter current count
   * @returns increased counter
   */
  private rowCounterAdd(counter: number): number {
    if (counter < this.options.rowSize) {
      return (counter += 1);
    }
    return counter;
  }

  /**
   * decreases counter, only when higher than 0
   * @param {number} counter current count
   * @returns decreased counter
   */
  private rowCounterRemove(counter: number): number {
    if (counter > 0) {
      this.removableBeforeWasZero = false;
      return (counter -= 1);
    } else {
      this.removableBeforeWasZero = true;
    }
    return counter;
  }

  /**
   * checks input with correct data
   * validation
   *  - set all lower case
   *  - remove spaces at end
   */
  public checkTest() {
    if (this.options.order) { // TRANSLATION CHECK
      if (this.testFormGroup.get('vocTrans').value &&
        (this.testFormGroup.get('vocTrans').value as string).toLowerCase().replace(/\s+$/, '') == this.currentCard.translation.toLowerCase()) {
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
        (this.testFormGroup.get('vocWord').value as string).toLowerCase().replace(/\s+$/, '') == this.currentCard.word.toLowerCase()) {
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

  /**
   * undo wrong validation
   * input is validated as correct
   */
  public undoneWrongCheck() {
    // all cards were saved and updated -> find updated card
    this.currentCard = this.vocabCards.find(card => card.id == this.currentCard.id);
    if (!this.currentCard) {
      return;
    }
    if (this.options.order) {
      this.currentCard.transCorrect++;
      if (!this.removableBeforeWasZero) this.currentCard.transCorrectRow = this.rowCounterAdd(this.currentCard.transCorrectRow);
      this.currentCard.transCorrectRow = this.rowCounterAdd(this.currentCard.transCorrectRow);
    } else {
      this.currentCard.wordWrong++;
      if (!this.removableBeforeWasZero) this.currentCard.wordCorrectRow = this.rowCounterAdd(this.currentCard.wordCorrectRow);
      this.currentCard.wordCorrectRow = this.rowCounterAdd(this.currentCard.wordCorrectRow);
    }
    this.showSuccess = true;
    this.showWrong = false;
    // SAVE & NEXT
    this.vocabService.saveVocabulary();
    setTimeout(() => {
      this.selectNextCard();
    }, 1500)
  }

  /**
   * change order between
   * word - translation
   * translation - word
   */
  public changeOrder() {
    this.options.order = !this.options.order;
    this.setCardContent();
  }

  /**
   * return language string of current Card
   * @param {E_VocabCard} vocabCard 
   * @returns {string} language
   */
  public getCardLanguage(vocabCard: E_VocabCard): string {
    if (!vocabCard) {
      return ''
    }
    return this.vocabulary.find(coll => coll.id == vocabCard.collectionId).language;
  }

  /**
   * return translation language of current Card
   * @param {E_VocabCard} vocabCard 
   * @returns {string} translation language
   */
  public getCardTransLanguage(vocabCard: E_VocabCard): string {
    if (!vocabCard) {
      return ''
    }
    return this.vocabulary.find(coll => coll.id == vocabCard.collectionId).translateLang;
  }

  /**
   * creates array for ngFor
   * @param {number} rowCounter 
   * @returns {Array<any>} dummy array
   */
  public getArrayOfCorrect(rowCounter: number): Array<any> {
    return Array(rowCounter);
  }

  /**
   * enter key press events
   * depending on test status
   */
  public enterKeyPressed() {
    if (!this.currentCard || this.showWrong) {
      this.selectNextCard();
    } else {
      this.checkTest();
    }
  }

  /***** MODALS & POPOVER *****/

  public async presentTestOptions(ev: any) {
    const modal = await this.modalController.create({
      component: TestOptionsModalComponent,
      animated: true,
      backdropDismiss: true,
      swipeToClose: true,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.5, 0.7, 1],
      componentProps: {}
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  /**
   * present modal for selecting specific collections
   * @param {Event} event 
   */
  public async presentCollectionModal(event: Event) {
    const modal = await this.modalController.create({
      component: CollectionSelectorModalComponent,
      animated: true,
      backdropDismiss: true,
      swipeToClose: true,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.5, 0.7, 1],
      componentProps: { 
        vocabulary: this.vocabulary,
      }
    });
    await modal.present();
  }
}
