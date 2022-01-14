import { Component } from '@angular/core';
import { AlertController, ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VocabInfoModalComponent } from 'src/app/pages/vocab-info-modal/vocab-info-modal.component';
import { VocabInfoModalModule } from 'src/app/pages/vocab-info-modal/vocab-info-modal.module';
import { PopoverCollectionComponent } from 'src/app/shared/popover/popover-collection/popover-collection.component';
import { PopoverVocabularyComponent } from 'src/app/shared/popover/popover-vocabulary/popover-vocabulary.component';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';
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
  public showSearch: boolean = false;
  public showSearchResults: boolean = false;

  public selectedCollection: E_VocabCollection = undefined;
  public selectedCards: E_VocabCard[] = [];

  constructor(
    private vocabService: VocabManagerService,
    private popoverController: PopoverController,
    private platform: Platform,
    private translateService: TranslateService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) {
    this.vocabService.getAllVocabulary()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((respCollections: E_VocabCollection[]) => {
        this.collections = respCollections;
        if (this.selectedCollection) {
          this.selectedCollection = this.collections.find(coll => coll.id == this.selectedCollection.id);
        }
      });
    this.vocabService.loadVocabulary();
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.showVocList = false;
    });
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
      componentProps: { collection: this.selectedCollection },
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data == "delete") {
      const alert = await this.alertController.create({
        header: this.translateService.instant('DELETE_COLLECTION'),
        message: this.translateService.instant('DELETE_COLLECTION_TITLE', { title: this.selectedCollection.title }),
        buttons: [
          {
            text: this.translateService.instant('CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => { }
          }, {
            text: this.translateService.instant('OKAY'),
            handler: async () => {
              this.vocabService.deleteCollection(this.selectedCollection.id);
              this.showVocList = false;

              const toast = await this.toastController.create({
                header: this.translateService.instant('COLLECTION_DELETED'),
                message: this.selectedCollection.title,
                color: 'danger',
                position: 'bottom',
                duration: 2000,
              });
              toast.present();
            }
          }
        ]
      });

      await alert.present();
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
      componentProps: { collections: this.collections },
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
  }

  public setSearch(event: any) {
    const searchTerm = (event.detail.value as string).toLowerCase();

    if (searchTerm.length <= 0) {
      this.showSearchResults = false;
      return;
    }

    let vocabList: E_VocabCard[] = [];

    this.collections.forEach(vocColl => {
      vocColl.vocabulary.forEach(vocCard => {
        if (vocCard.word?.toLowerCase().includes(searchTerm) ||
          vocCard.translation?.toLowerCase().includes(searchTerm) ||
          vocCard.pronunciation?.toLowerCase().includes(searchTerm) ||
          vocCard.description?.toLowerCase().includes(searchTerm)) {
          vocabList.push(vocCard);
        }
      });
    });

    this.selectedCards = vocabList;
    this.showSearchResults = true;
  }

  public toggleSearchbar() {
    if (!this.showSearch) {
      this.showSearch = true;
    } else {
      this.closeSearchbar();
    }
  }

  public closeSearchbar() {
    this.showSearchResults = false;
    this.showSearch = false;
  }
  
  public async openVocabInfoModal(vocab: E_VocabCard) {
    const modal = await this.modalController.create({
      component: VocabInfoModalComponent,
      componentProps: {
        vocab: vocab,
        collection: this.collections.find(coll => coll.id == vocab.collectionId),
      }
    });
    return await modal.present();
  }

  public getCollection(collId: string): string {
    return this.collections.find(coll => coll.id == collId).title;
  }
}
