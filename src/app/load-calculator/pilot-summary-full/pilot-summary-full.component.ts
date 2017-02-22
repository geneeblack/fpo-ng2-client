import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Utility } from '../utility/utility';

@Component({
  selector: '[pilot-summary-full]',
  templateUrl: './pilot-summary-full.component.html',
  styleUrls: ['./pilot-summary-full.component.css', '../load-calculator.component.css'],
})
export class PilotSummaryFullComponent implements OnInit {
  @Input() pilot;

  constructor() { }

  ngOnInit() {
  }


}
