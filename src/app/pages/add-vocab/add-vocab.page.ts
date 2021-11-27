import { Component } from '@angular/core';
import { VocabManagerService } from 'src/services/vocab-manager.service';

@Component({
  selector: 'add-vocab-page',
  templateUrl: 'add-vocab.page.html',
  styleUrls: ['add-vocab.page.scss']
})
export class AddVocabPage {

  constructor(
    private vocabService: VocabManagerService,
  ) {}

}
