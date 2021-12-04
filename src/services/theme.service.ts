import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';

export enum E_Theme { 'default', 'dark' }

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private _currentTheme: E_Theme = E_Theme.default;
    private themeSubject: Subject<E_Theme> = new Subject();

    constructor() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        prefersDark.addListener((e) => this.setTheme(e.matches ? E_Theme.dark : E_Theme.default));
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
        this.themeSubject.next(value);
    }

    private get currentTheme(): E_Theme {
        return this._currentTheme;
    }
}
