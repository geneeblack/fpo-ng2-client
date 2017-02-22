import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[master-loading-summary]',
  templateUrl: './master-loading-summary.component.html',
  styleUrls: ['../load-calculator.component.css', './master-loading-summary.component.css']
})
export class MasterLoadingSummaryComponent implements OnInit {
  @Input() batch;

  constructor() { }

  ngOnInit() {
  }

}
