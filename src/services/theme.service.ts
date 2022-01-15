import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

export enum E_Theme { 'default', 'dark' }

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private _currentTheme: E_Theme = E_Theme.default;
    private themeSubject: Subject<E_Theme> = new Subject();
    private ngUnsubscribe: Subject<void> = new Subject();

    constructor(
        private storageService: StorageService,
    ) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        prefersDark.addListener((e) => this.setTheme(e.matches ? E_Theme.dark : E_Theme.default));
        const unsubStorage: Subject<void> = new Subject();

        this.storageService.getReadyInitSubject()
            .pipe(takeUntil(this.ngUnsubscribe), takeUntil(unsubStorage))
            .subscribe((value) => {
                if (value) {
                    this.storageService.get(environment.themeStorageKey).then(theme => {
                        if (theme) {
                            this.setTheme(theme);
                        }
                    });
                    unsubStorage.next();
                }
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public toggleTheme() {
        if (this.currentTheme == E_Theme.default) {
            this.setTheme(E_Theme.dark);
        } else if (this.currentTheme == E_Theme.dark) {
            this.setTheme(E_Theme.default);
        }
    }

    public setTheme(theme: E_Theme) {
        this.currentTheme = theme;
        if (theme == E_Theme.default) {
            document.body.classList.remove('dark');
        } else if (theme == E_Theme.dark) {
            document.body.classList.add('dark');
        }
    }

    public getThemeSubject(): Subject<E_Theme> {
        return this.themeSubject;
    }

    public getTheme(): void {
        this.themeSubject.next(this.currentTheme);
    }

    /*** GETTER & SETTER ***/
    private set currentTheme(value: E_Theme) {
        this._currentTheme = value;
        this.storageService.set(environment.themeStorageKey, value);
        this.themeSubject.next(value);
    }

    private get currentTheme(): E_Theme {
        return this._currentTheme;
    }
}
