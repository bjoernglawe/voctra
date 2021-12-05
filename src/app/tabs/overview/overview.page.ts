import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';
import { E_Theme, ThemeService } from 'src/services/theme.service';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'app-overview',
  templateUrl: 'overview.page.html',
  styleUrls: ['overview.page.scss']
})
export class OverviewPage {

  private ngUnsubscribe: Subject<void> = new Subject();

  private currentTheme: E_Theme = E_Theme.default;
  public currentCollections: E_VocabCollection[] = [];

  public collectionCountTmp: number = 0;
  public vocabularyCountTmp: number = 0;
  public learnedCountTmp: number = 0;
  public openCountTmp: number = 0;
  public trainCountTmp: number = 0;
  public mostCorrectTransTmp: E_VocabCard = undefined;
  public mostWrongTransTmp: E_VocabCard = undefined;
  public mostCorrectWordTmp: E_VocabCard = undefined;
  public mostWrongWordTmp: E_VocabCard = undefined;

  constructor(
    private themeService: ThemeService,
    private vocabService: VocabManagerService,
  ) {
    this.themeService.getThemeSubject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((theme: E_Theme) => {
        this.currentTheme = theme;
      });
    this.themeService.getTheme();

    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((respCollections: E_VocabCollection[]) => {
        this.currentCollections = respCollections;
        this.initValues();
      });
    this.vocabService.loadVocabulary();
  }

  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  private initValues() {
    this.collectionCountTmp = this.collectionCount;
    this.vocabularyCountTmp = this.vocabularyCount;
    this.learnedCountTmp = this.learnedCount;
    this.openCountTmp = this.openCount;
    this.trainCountTmp = this.trainCount;
    this.mostCorrectTransTmp = this.mostCorrectTrans;
    this.mostWrongTransTmp = this.mostWrongTrans;
    this.mostCorrectWordTmp = this.mostCorrectWord;
    this.mostWrongWordTmp = this.mostWrongWord;
  }

  /*** GETTER & SETTER ***/
  get isDark(): boolean {
    return (this.currentTheme === E_Theme.dark)
  }

  get isDefault(): boolean {
    return (this.currentTheme === E_Theme.default)
  }

  get collectionCount(): number {
    return this.currentCollections.length;
  }

  get vocabularyCount(): number {
    let count = 0;
    this.currentCollections.forEach(coll => {
      count += coll.vocabulary.length;
    })
    return count;
  }
  
  get learnedCount(): number {
    let count = 0;
    this.currentCollections.forEach(coll => {
      coll.vocabulary.forEach(voc => {
        if (voc.transCorrectRow >= 10) {
          count++;
        }
      })
    })
    return count;
  }
  
  get openCount(): number {
    let count = 0;
    this.currentCollections.forEach(coll => {
      coll.vocabulary.forEach(voc => {
        if (voc.transCorrectRow < 10) {
          count++;
        }
      })
    })
    return count;
  }
  
  get trainCount(): number {
    let count = 0;
    this.currentCollections.forEach(coll => {
      coll.vocabulary.forEach(voc => {
        if (voc.transCorrectRow < 10) {
          count += voc.transCorrect;
          count += voc.transWrong;
          count += voc.wordCorrect;
          count += voc.wordWrong;
        }
      })
    })
    return count;
  }
  
  get mostCorrectTrans(): E_VocabCard {
    let mostCorrectVoc: E_VocabCard;
    this.currentCollections.forEach(coll => {
      coll.vocabulary.forEach(voc => {
        if (!mostCorrectVoc || mostCorrectVoc.transCorrect < voc.transCorrect) {
          mostCorrectVoc = voc;
        }
      })
    });
    return mostCorrectVoc;
  }
  
  get mostWrongTrans(): E_VocabCard {
    let mostWrongVoc: E_VocabCard;
    this.currentCollections.forEach(coll => {
      coll.vocabulary.forEach(voc => {
        if (!mostWrongVoc || mostWrongVoc.transWrong < voc.transWrong) {
          mostWrongVoc = voc;
        }
      })
    })
    return mostWrongVoc;
  }

  get mostCorrectWord(): E_VocabCard {
    let mostCorrectVoc: E_VocabCard;
    this.currentCollections.forEach(coll => {
      coll.vocabulary.forEach(voc => {
        if (!mostCorrectVoc || mostCorrectVoc.wordCorrect < voc.wordCorrect) {
          mostCorrectVoc = voc;
        }
      })
    })
    return mostCorrectVoc;
  }
  
  get mostWrongWord(): E_VocabCard {
    let mostWrongVoc: E_VocabCard;
    this.currentCollections.forEach(coll => {
      coll.vocabulary.forEach(voc => {
        if (!mostWrongVoc || mostWrongVoc.wordWrong < voc.wordWrong) {
          mostWrongVoc = voc;
        }
      })
    })
    return mostWrongVoc;
  }
}
