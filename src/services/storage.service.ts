import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  private storageInitSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
  ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.storageInitSubject.next(true);
  }

  public getReadyInitSubject(): BehaviorSubject<boolean> {
    return this.storageInitSubject;
  }

  // ---- WORK WITH STORAGE ---- //

  public set(key: string, value: any): void {
    this._storage.set(key, value);
  }

  public get(key: string): Promise<any> {
    return this._storage.get(key);
  }

  public remove(key: string): void {
    this._storage.remove(key);
  }

  public keys(): Promise<string[]> {
    return this._storage.keys();
  }
}
