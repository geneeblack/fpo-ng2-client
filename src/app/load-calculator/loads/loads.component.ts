import {
  Component,
  OnInit,
  Input
} from '@angular/core';


var Math: any;

@Component({
  selector: '[loads]',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.css', '../load-calculator.component.css'],
})
export class LoadsComponent implements OnInit {
  @Input() loads;

  constructor() {}

  ngOnInit() {}

}
