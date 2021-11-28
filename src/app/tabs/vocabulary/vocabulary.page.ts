import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PopoverCollectionComponent } from 'src/app/shared/popover-collection/popover-collection.component';
import { PopoverVocabularyComponent } from 'src/app/shared/popover-vocabulary/popover-vocabulary.component';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'vocabulary.page.html',
  styleUrls: ['vocabulary.page.scss']
})
export class VocabularyPage {
  private ngUnsubscribe: Subject<void> = new Subject();

  public collections: E_VocabCollection[] = [];

  public showVocMore: boolean = false;
  public showVocList: boolean = false;
  public selectedCollection: E_VocabCollection = undefined;

  constructor(
    private vocabService: VocabManagerService,
    private popoverController: PopoverController,
  ) {
    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((respCollections: E_VocabCollection[]) => {
        this.collections = respCollections;
      });
    this.vocabService.loadVocabulary();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public selectCollection(collection: E_VocabCollection) {
    this.selectedCollection = collection;
    this.showVocList = true;
  }

  public async presentCollPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverCollectionComponent,
      cssClass: '',
      event: ev,
      showBackdrop: true,
      translucent: true,
      keyboardClose: true,
      componentProps: {collection: this.selectedCollection},
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    
    if (data == "delete") {
      this.vocabService.deleteCollection(this.selectedCollection.id);
      this.showVocList = false;
    }
  }

  public async presentVocPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverVocabularyComponent,
      cssClass: '',
      event: ev,
      showBackdrop: true,
      translucent: true,
      keyboardClose: true,
      componentProps: {collection: this.selectedCollection},
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
  }
}
