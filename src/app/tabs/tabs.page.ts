import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public keyboardOpen: boolean = false;

  constructor(
    private platform: Platform,
  ) {
    this.platform.keyboardDidShow.subscribe(ev => {
      const { keyboardHeight } = ev;
      this.keyboardOpen = true;
    });

    this.platform.keyboardDidHide.subscribe(() => {
      this.keyboardOpen = false;
    });
  }

}
