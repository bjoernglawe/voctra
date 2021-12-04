import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { E_Theme, ThemeService } from 'src/services/theme.service';

@Component({
  selector: 'app-overview',
  templateUrl: 'overview.page.html',
  styleUrls: ['overview.page.scss']
})
export class OverviewPage {

  private ngUnsubscribe: Subject<void> = new Subject();

  private currentTheme: E_Theme = E_Theme.default;

  constructor(
    private themeService: ThemeService,
  ) {
    this.themeService.getThemeSubject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((theme: E_Theme) => {
        this.currentTheme = theme;
      });
    this.themeService.getTheme();
  }

  public toggleTheme() {
    this.themeService.toggleTheme();
  }


  /*** GETTER & SETTER ***/
  get isDark(): boolean {
    return (this.currentTheme === E_Theme.dark)
  }

  get isDefault(): boolean {
    return (this.currentTheme === E_Theme.default)
  }
}
