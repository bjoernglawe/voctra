import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { E_VocabCollection } from 'src/models/vocabulary.model';
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
  private currentCollections: E_VocabCollection[] = [];

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
      });
    this.vocabService.loadVocabulary();
  }

  public toggleTheme() {
    this.themeService.toggleTheme();
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
}
