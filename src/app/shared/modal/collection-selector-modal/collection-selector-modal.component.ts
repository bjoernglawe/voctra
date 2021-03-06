import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { E_TestOptions } from 'src/models/test-options.model';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { TestOptionsService } from 'src/services/test-options.service';

@Component({
  selector: 'collection-selector-modal',
  templateUrl: './collection-selector-modal.component.html',
  styleUrls: ['./collection-selector-modal.component.scss']
})
export class CollectionSelectorModalComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject();

  @Input('vocabulary') vocabulary: E_VocabCollection[] = [];
  public selectVocab: (E_VocabCollection & { selected?: boolean })[] = [];
  private options: E_TestOptions = new E_TestOptions();

  constructor(
    private modalController: ModalController,
    private optionsService: TestOptionsService,
  ) {
    this.optionsService.getOptions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: E_TestOptions) => {
        this.options = res;
        this.selectVocab = this.vocabulary.map((coll) => {
          let mapColl: (E_VocabCollection & { selected?: boolean }) = coll;
          mapColl.selected = !res.selectedCollIds.find(id => id == coll.id);
          return mapColl;
        });
      });
    optionsService.loadOptions();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public saveModal(): void {
    this.options.selectedCollIds =
      this.selectVocab
        .filter(coll => !coll.selected)
        .map(coll => coll.id);
    this.optionsService.saveOptions();
    this.modalController.dismiss();
  }
}
