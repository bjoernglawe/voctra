import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { E_TestOptions } from 'src/models/test-options.model';
import { E_VocabCollection } from 'src/models/vocabulary.model';
import { TestOptionsService } from 'src/services/test-options.service';

@Component({
  selector: 'test-options-modal',
  templateUrl: './test-options-modal.component.html',
  styleUrls: ['./test-options-modal.component.scss']
})
export class TestOptionsModalComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject();

  public options: E_TestOptions = new E_TestOptions();

  constructor(
    private modalController: ModalController,
    private optionsService: TestOptionsService,
  ) {
    this.optionsService.getOptions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: E_TestOptions) => {
        this.options = res;
      })
  }

  ngOnInit(): void {
    this.optionsService.loadOptions();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public saveModal(): void {
    this.optionsService.saveOptions();
    this.modalController.dismiss({});
  }
}
