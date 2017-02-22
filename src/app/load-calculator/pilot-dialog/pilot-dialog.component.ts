import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  trigger,
  state,
  style,
  animate,
  transition,
  AfterViewInit,
  ElementRef,
  Directive
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Pilot
} from './pilot-dialog.interface'

declare var $: any;

@Component({
  selector: 'pilot-dialog',
  templateUrl: './pilot-dialog.component.html',
  styleUrls: ['./pilot-dialog.component.css', '../load-calculator.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({
          transform: 'scale3d(.3, .3, .3)'
        }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({
          transform: 'scale3d(.0, .0, .0)'
        }))
      ])
    ])
  ]
})
export class PilotDialogComponent implements OnInit, AfterViewInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Input() inbatch: any;
  @Input() inpilots: any;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pilotAdd: EventEmitter<Pilot> = new EventEmitter<Pilot>();
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  private pilot: Pilot;
  private applicationTypes = [];

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.applicationTypes = this.getApplicationTypes();
  }

  ngOnChanges() {
    if (this.visible) {
      this.pilot = this.newPilot();
    }
  }


  getApplicationTypes() {
    var types = [];
    var applicatorProducts = this.inbatch.applicator.products ? this.inbatch.applicator.products : [];
    var retailerProducts = this.inbatch.retailers && this.inbatch.retailers.length > 0 ? this.inbatch.retailers.map(retailer => retailer.products).reduce((a, b) => a.concat(b)) : []
    var products = applicatorProducts.concat(retailerProducts);
    if (products.filter(item => !item.is_liquid).length > 0) {
      types.push({
        value: 'dry',
        display: 'Dry'
      });
    }
    if (products.filter(item => item.is_liquid).length > 0) {
      types.push({
        value: 'liquid',
        display: 'Liquid'
      });
    }
    return types;
  }

  newPilot() {
    var pilot = {
      name: '',
      volume: null,
      acres: this.applicationTypes.length > 0 ? this.acresRemaining(this.applicationTypes[0].value) : 0,
      applicationType: this.applicationTypes.length > 0 ? this.applicationTypes[0].value : '',
      volume_units: '',
      originalAcresRemaining: this.applicationTypes.length > 0 ? this.acresRemaining(this.applicationTypes[0].value).toString() : '0'
    }

    if (pilot.applicationType == 'dry' && this.inbatch.applicator.country == 'CA')
      pilot.volume_units = 'kg';
    else if (pilot.applicationType == 'dry' && this.inbatch.applicator.country != 'CA')
      pilot.volume_units = 'pound';
    else if (pilot.applicationType == 'liquid' && this.inbatch.applicator.country == 'CA')
      pilot.volume_units = 'L';
    else if (pilot.applicationType == 'liquid' && this.inbatch.applicator.country != 'CA')
      pilot.volume_units = 'gallon';

    pilot.volume = localStorage.getItem(pilot.volume_units) ? Number(localStorage.getItem(pilot.volume_units)) : 1;
    return pilot;
  }

  acresRemaining(applicationType) {
    return this.inbatch.total_acres - this.acresAssigned(applicationType);
  }

  acresAssigned(applicationType) {
    return this.inpilots.filter(item => item.applicationType == applicationType).reduce(function (sum, pilot) {
      return sum + pilot.acres;
    }, 0.0)
  }

  onApplicationTypeChange(event) {
    this.pilot.acres = this.acresRemaining(event);
    this.pilot.originalAcresRemaining = this.pilot.acres.toString();
    if (event == 'dry' && this.inbatch.applicator.country == 'CA')
      this.pilot.volume_units = 'kg';
    else if (event == 'dry' && this.inbatch.applicator.country != 'CA')
      this.pilot.volume_units = 'pound';
    else if (event == 'liquid' && this.inbatch.applicator.country == 'CA')
      this.pilot.volume_units = 'L';
    else if (event == 'liquid' && this.inbatch.applicator.country != 'CA')
      this.pilot.volume_units = 'gallon';
    this.pilot.volume = localStorage.getItem(this.pilot.volume_units) ? Number(localStorage.getItem(this.pilot.volume_units)) : 1
  }

  addPilot(f: Pilot, isValid: boolean) {
    console.log(f, isValid);
    if (isValid) {
      if (f.applicationType == 'dry' && this.inbatch.applicator.country == 'CA')
        f.volume_units = 'Kg';
      if (f.applicationType == 'dry' && this.inbatch.applicator.country != 'CA')
        f.volume_units = 'pound';
      if (f.applicationType == 'liquid' && this.inbatch.applicator.country == 'CA')
        f.volume_units = 'L';
      if (f.applicationType == 'liquid' && this.inbatch.applicator.country != 'CA')
        f.volume_units = 'gallon';

      localStorage.setItem(f.volume_units, f.volume.toString());
      this.visible = false;
      this.visibleChange.emit(this.visible);
      this.pilotAdd.emit(f);
    }
    return false;
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    return false;
  }

  goto(link) {
    $('#' + link).focus();
    $('#' + link).select();
    $('#' + link).fadeTo(100, 0.5, function () { $(this).fadeTo(500, 1.0); });
    return false;
  }

}
