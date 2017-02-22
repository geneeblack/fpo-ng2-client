import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pilot-delete-dialog',
  templateUrl: './pilot-delete-dialog.component.html',
  styleUrls: ['./pilot-delete-dialog.component.css', '../load-calculator.component.css'],
})
export class PilotDeleteDialogComponent implements OnInit {
  @Input() pilot;

  constructor() { }

  ngOnInit() {
  }

}
