import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'popover-test',
  templateUrl: './popover-test.component.html',
  styleUrls: ['./popover-test.component.scss']
})
export class PopoverTestComponent implements OnInit {

  @Input() settings: any = undefined;

  constructor(
    private popover: PopoverController,
  ) { }

  ngOnInit(): void {
  }
  
  ClosePopover() {
    this.popover.dismiss();
  }


}
