import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { E_TestOptions } from 'src/models/test-options.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TestOptionsService {
  private _optionsStorage: E_TestOptions = new E_TestOptions();
  private ngUnsubscribe: Subject<void> = new Subject();
  private optionsSubject: Subject<E_TestOptions> = new Subject();

  constructor(
    private storageService: StorageService,
  ) {
    this.loadOptions();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public loadOptions(): void {
    const unsubStorage: Subject<void> = new Subject();

    this.storageService.getReadyInitSubject()
      .pipe(takeUntil(this.ngUnsubscribe), takeUntil(unsubStorage))
      .subscribe((value) => {
        if (value) {
          this.storageService.keys().then((keys: string[]) => {
            let index = keys.findIndex(key => key == environment.optionsStorageKey);
            if (index >= 0) {
              this.storageService.get(environment.optionsStorageKey).then((value: any) => {
                if (value) {
                  this.setOptions(value);
                }
              });
            } else {
              this.setOptions(new E_TestOptions());
            }
            unsubStorage.next();
          })
        }
      })
  }

  public getOptions(): Subject<E_TestOptions> {
    return this.optionsSubject;
  }

  private setOptions(options: any): void {
    this._optionsStorage = E_TestOptions.createObject(options);
    this.optionsSubject.next(this._optionsStorage);
  }

  public saveOptions(): void {
    this.storageService.set(environment.optionsStorageKey, this._optionsStorage);
    this.loadOptions();
  }
}
