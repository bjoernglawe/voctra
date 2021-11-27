import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { E_VocabCard, E_VocabCollection } from 'src/models/vocabulary.model';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VocabManagerService {
  private _vocabStorage: E_VocabCollection[] = [];
  private ngUnsubcribe: Subject<void> = new Subject();

  constructor(
    private storageService: StorageService,
  ) {
    this.init();
  }

  private init(): void {
    const unsubStorage: Subject<void> = new Subject();

    this.storageService.getReadyInitSubject()
      .pipe(takeUntil(this.ngUnsubcribe), takeUntil(unsubStorage))
      .subscribe((value) => {
        if (value) {
          this.storageService.keys().then((keys: string[]) => {
            let index = keys.findIndex(key => key == environment.vocabStorageKey);
            if (index >= 0) {
              this.storageService.get(environment.vocabStorageKey).then((value: any) => {
                if (value) {
                  this._vocabStorage = value;
                }
              });
            }
            unsubStorage.next();
          })
        }
      })
  }

  public getAllVocabulary(): E_VocabCollection[] {
    return this._vocabStorage;
  }

  public saveVocabulary(): void {
    this.storageService.set(environment.vocabStorageKey, this._vocabStorage);
  }

  public createVocabCollection(
    title: string,
    language: string,
    translateLang: string,
    description?: string,
    color?: string): E_VocabCollection {
    let newCollection: E_VocabCollection = {
      id: uuidv4(),
      title,
      language,
      translateLang,
      date: new Date().toString(),
      vocabulary: [],
    }
    if (description) {
      newCollection.description = description;
    }
    if (color) {
      newCollection.color = color;
    }
    this._vocabStorage.push(newCollection);
    this.saveVocabulary();
    return newCollection;
  }

  public createVocabCard(
    collectionId: string,
    word: string,
    translation: string,
    pronunciation?: string,
    description?: string,
  ): E_VocabCard {
    let newCard: E_VocabCard = {
      id: uuidv4(),
      word,
      translation,
      correct: 0,
      wrong: 0,
    }
    if (pronunciation) {
      newCard.pronunciation = pronunciation;
    }
    if (description) {
      newCard.description = description;
    }
    let collection = this._vocabStorage.find(coll => coll.id == collectionId);
    if (collection) {
      collection.vocabulary.push(newCard);
    } else {
      return undefined;
    }
    this.saveVocabulary();
    return newCard;
  }
}
