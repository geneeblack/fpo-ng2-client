import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Utility } from '../utility/utility';

@Component({
  selector: '[pilot-summary-equal]',
  templateUrl: './pilot-summary-equal.component.html',
  styleUrls: ['./pilot-summary-equal.component.css', '../load-calculator.component.css'],
})
export class PilotSummaryEqualComponent implements OnInit {
  @Input() pilot;

  constructor() { }

  ngOnInit() {
  }

}
