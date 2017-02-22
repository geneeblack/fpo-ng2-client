
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FPOService } from '../services/fpo.service';
import { Title }     from '@angular/platform-browser';

import { MasterLoadingSummaryComponent } from './master-loading-summary/master-loading-summary.component';
import { PilotDialogComponent } from './pilot-dialog/pilot-dialog.component';
import { PilotSummaryFullComponent } from './pilot-summary-full/pilot-summary-full.component';
import { PilotSummaryEqualComponent } from './pilot-summary-equal/pilot-summary-equal.component';
import { LoadsComponent } from './loads/loads.component';
import { Utility } from './utility/utility';

import {
  Pilot
} from './pilot-dialog/pilot-dialog.interface';

declare var $: any;

@Component({
  selector: 'app-load-calculator',
  templateUrl: './load-calculator.component.html',
  styleUrls: ['./load-calculator.component.css',],
  providers: []
})
export class LoadCalculatorComponent implements OnInit {
  private batch: any;
  private job: any;
  public errorMessage: string;
  private display: boolean;
  private showDialog = false;
  private batch_id: number;
  private applicator_id: number;
  private partnership_id: number;
  private jobs: [number];
  private calcType: string = 'equal';

  private pilots: Pilot[] = [];
  private dryPilots: Pilot[] = [];
  private liquidPilots: Pilot[] = [];

  constructor(private fpoService: FPOService, private route: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle( "Load Calculator" );
    this.route.params.subscribe(params => {
      this.batch_id = +params['batch_id'];
      this.applicator_id = +params['applicator_id'];
      this.partnership_id = +params['partnership_id'];
      this.jobs = params['jobs'] ? JSON.parse(params['jobs']) : null;

      if (this.applicator_id && this.batch_id)
        this.getLoadCalculatorByBatch(this.applicator_id, this.batch_id);
      else if (this.partnership_id && this.jobs)
        this.getLoadCalculatorByJobs(this.partnership_id, this.jobs);
    });
  }

  getDryPilots(): Pilot[] {
    return this.pilots.filter(p => p.applicationType == 'dry');
  }

  getLiquidPilots(): Pilot[] {
    return this.pilots.filter(p => p.applicationType == 'liquid');
  }

  showPilotAdd(event) {
    event.visible = !event.visible;
  }

  handlePilotAdd(pilot) {
    this.pilots.push(pilot);
    if (this.calcType == 'full') {
      this.calculateFullLoads(pilot);
    } else {
      this.calculateEqualLoads(pilot);
    }

    this.liquidPilots = this.getLiquidPilots();
    this.dryPilots = this.getDryPilots();
  }

  handlePilotDelete(pilot) {
    this.pilots.splice(this.pilots.indexOf(pilot), 1);

    this.liquidPilots = this.getLiquidPilots();
    this.dryPilots = this.getDryPilots();

    return false;
  }

  calculateEqualLoadsChecked() {
    $('label[for="full"]').removeClass('ui-state-active');
    $('#full').removeAttr('checked')
    $('label[for="equal"]').addClass('ui-state-active');
    $('#equal').attr('checked', 'checked');
    this.calcType = 'equal';
    this.pilots.forEach(p => { this.calculateEqualLoads(p); })

    return false;
  }

  calculateFullLoadsChecked() {
    $('label[for="equal"]').removeClass('ui-state-active');
    $('#equal').removeAttr('checked')
    $('label[for="full"]').addClass('ui-state-active');
    $('#full').attr('checked', 'checked')
    this.calcType = 'full';
    this.pilots.forEach(p => { this.calculateFullLoads(p); })

    return false;
  }


  calcRemainingflozs(gallons) {
    return Utility.roundTo((gallons - Math.floor(gallons)), 4) * 128.0;
  }

  calculateEqualLoads(pilot) {
    var acres = pilot.acres,
      operatorPercentage = acres / this.batch.load_calc.batch_acres;
    var volume_in_units = this.batch.load_calc.batch_volume_in_units * operatorPercentage;
    var volume_units = this.batch.load_calc.batch_volume_units;
    var weight_in_units = this.batch.load_calc.batch_weight_in_units * operatorPercentage;
    var weight_units = this.batch.load_calc.batch_weight_units;

    var tankVolume = pilot.volume;

    var exactLoadCount = 0;
    if (pilot.applicationType == 'dry')
      exactLoadCount = weight_in_units / tankVolume;
    else
      exactLoadCount = volume_in_units / tankVolume;
    var equalLoadCount = Math.ceil(exactLoadCount),
      loadVolumeInUnits = volume_in_units / equalLoadCount,
      loadWeightInUnits = weight_in_units / equalLoadCount,
      loadWeightUnits = weight_units,

      loadAcres = acres / equalLoadCount,

      carrierVolumeInUnits = this.batch.load_calc.batch_carrier_volume_in_units * operatorPercentage,
      carrierVolumeUnits = this.batch.load_calc.batch_carrier_volume_units,
      carrierWeightInUnits = this.batch.load_calc.batch_carrier_weight_in_units * operatorPercentage,
      carrierWeightUnits = this.batch.load_calc.batch_carrier_weight_units,

      loadCarrierVolumeInUnits = carrierVolumeInUnits / equalLoadCount,
      loadCarrierVolumeUnits = carrierVolumeUnits,
      loadCarrierWeightInUnits = carrierWeightInUnits / equalLoadCount,
      loadCarrierWeightUnits = weight_units,
      batchProducts = this.batch.load_calc.products.filter(p => p.is_liquid == (pilot.applicationType == 'liquid')),
      loads = [];
    pilot.equalLoadCount = Utility.roundTo(equalLoadCount, 2);
    pilot.equalLoadSize = pilot.applicationType == 'liquid' ? Utility.roundTo(loadVolumeInUnits, 2) : Utility.roundTo(loadWeightInUnits, 2);
    pilot.equalLoadSizeUnits = pilot.applicationType == 'liquid' ? carrierVolumeUnits : carrierWeightUnits;
    pilot.acresPerEqualLoad = Utility.roundTo(loadAcres, 2);

    var load = {
      heading: 'Equal Loads',
      volumeInUnits: loadVolumeInUnits,
      volumeUnits: loadCarrierVolumeUnits,
      weightInUnits: loadWeightInUnits,
      weightUnits: loadCarrierWeightUnits,
      carrierVolumeInUnits: loadCarrierVolumeInUnits,
      carrierVolumeUnits: loadCarrierVolumeUnits,
      carrierWeightInUnits: loadCarrierWeightInUnits,
      carrierWeightUnits: loadCarrierWeightUnits,
      acres: acres / equalLoadCount,
      products: [],
      loadCount: equalLoadCount
    };


    batchProducts.forEach(p => {
      var volume_in_units = (p.total_volume_in_units * operatorPercentage) / equalLoadCount,
        weight_in_units = (p.total_weight_in_units * operatorPercentage) / equalLoadCount;
      var product = {
        name: p.name,
        base_product: p.base_product,
        rate_label: p.rate_label,
        volume_in_units: volume_in_units,
        volume_units: p.total_volume_units,
        weight_units: p.total_weight_units,
        weight_in_units: weight_in_units
      };
      load.products.push(product);
    });
    var water = {
      name: 'Water',
      base_product: 'Water',
      rate_label: null,
      weight_in_units: load.carrierWeightInUnits,
      weight_units: load.carrierWeightUnits,
      volume_units: load.carrierVolumeUnits,
      volume_in_units: load.carrierVolumeInUnits
    };
    if (pilot.applicationType == 'liquid')
      load.products.push(water);
    pilot.equal_load = load;
  }

  calculateFullLoads(pilot) {
    var acres = pilot.acres,
      operatorPercentage = acres / this.batch.load_calc.batch_acres;
    var volume_in_units = this.batch.load_calc.batch_volume_in_units * operatorPercentage;
    var volume_units = this.batch.load_calc.batch_volume_units;
    var weight_in_units = this.batch.load_calc.batch_weight_in_units * operatorPercentage;
    var weight_units = this.batch.load_calc.batch_weight_units;

    var exactLoadCount = 0, fullLoadFactor = 0;
    var tankVolume = pilot.volume;
    if (pilot.applicationType == 'dry') {
      exactLoadCount = weight_in_units / tankVolume;
      fullLoadFactor = tankVolume / weight_in_units;
    }
    else {
      exactLoadCount = volume_in_units / tankVolume;
      fullLoadFactor = tankVolume / volume_in_units;
    }

    var fullLoadCount = Math.floor(exactLoadCount),
      carrierVolumeInUnits = this.batch.load_calc.batch_carrier_volume_in_units * operatorPercentage,
      carrierVolumeUnits = this.batch.load_calc.batch_carrier_volume_units,
      carrierWeightInUnits = this.batch.load_calc.batch_carrier_weight_in_units * operatorPercentage,
      carrierWeightUnits = this.batch.load_calc.batch_carrier_weight_units,
      loadCarrierVolumeInUnits = carrierVolumeInUnits / fullLoadCount,
      loadCarrierVolumeUnits = volume_units,
      loadCarrierWeightInUnits = carrierWeightInUnits / fullLoadCount,
      loadCarrierWeightUnits = weight_units,

      batchProducts = this.batch.load_calc.products.filter(p => p.is_liquid == (pilot.applicationType == 'liquid')),
      fullLoadAcres = acres * fullLoadFactor,
      partialLoadFactor = exactLoadCount - fullLoadCount;
    pilot.fullLoadCount = fullLoadCount;
    pilot.acresPerFullLoad = Utility.roundTo(fullLoadAcres, 2);
    pilot.volumeUnits = carrierVolumeUnits
    pilot.partialLoadSize = Utility.roundTo((tankVolume * partialLoadFactor), 2);
    pilot.partialLoadSizeUnits = pilot.applicationType == 'liquid' ? carrierVolumeUnits: carrierWeightUnits;
    pilot.acresPerPartialLoad = Utility.roundTo((fullLoadAcres * partialLoadFactor), 2);

    var load = {
      heading: 'Full Loads',
      carrierVolumeInUnits: carrierVolumeInUnits * fullLoadFactor,
      carrierVolumeUnits: carrierVolumeUnits,
      carrierWeightInUnits: carrierWeightInUnits * fullLoadFactor,
      carrierWeightUnits: carrierWeightUnits,
      acres: acres * fullLoadFactor,
      products: [],
      loadCount: fullLoadCount
    };

    batchProducts.forEach(p => {
      var
        weight_in_units = (p.total_weight_in_units * operatorPercentage * fullLoadFactor),
        volume_in_units = (p.total_volume_in_units * operatorPercentage * fullLoadFactor);

      var product = {
        name: p.name,
        base_product: p.base_product,
        rate_label: p.rate_label,
        volume_in_units: volume_in_units,
        volume_units: p.total_volume_units,
        weight_in_units: weight_in_units,
        weight_units: p.total_weight_units
      };
      load.products.push(product);
    });
    var water = {
      name: 'Water',
      base_product: 'Water',
      rate_label: null,
      weight_in_units: load.carrierWeightInUnits,
      weight_units: load.carrierWeightUnits,
      volume_units: load.carrierVolumeUnits,
      volume_in_units: load.carrierVolumeInUnits
    };
    if (pilot.applicationType == 'liquid')
      load.products.push(water);

    pilot.full_load = load;

    var partialLoad = {
      heading: 'Partial Load',
      carrierVolumeInUnits: load.carrierVolumeInUnits * partialLoadFactor,
      carrierVolumeUnits: load.carrierVolumeUnits,
      carrierWeightInUnits: load.carrierWeightInUnits * partialLoadFactor,
      carrierWeightUnits: load.carrierWeightUnits,
      acres: load.acres * partialLoadFactor,
      products: [],
      loadCount: 1
    };

    load.products.forEach(p => {
      var
        weight_in_units = (p.weight_in_units * partialLoadFactor),
        volume_in_units = (p.volume_in_units * partialLoadFactor);

      var product = {
        name: p.name,
        base_product: p.base_product,
        rate_label: p.rate_label,
        volume_in_units: volume_in_units,
        volume_units: p.volume_units,
        weight_units: p.weight_units,
        weight_in_units: weight_in_units
      };
      partialLoad.products.push(product);
    });

    pilot.partial_load = partialLoad;
  }
  acresAssigned() {
    return this.pilots.reduce(function (sum, pilot) {
      return sum + pilot.acres;
    }, 0.0);
  }

  acresRemaining() {
    return this.batch.load_calc.batch_acres - this.acresAssigned();
  }


  getLoadCalculatorByBatch(applicator_id: number, batch_id: number) {
    this.fpoService.getLoadCalculatorByBatch(applicator_id, batch_id)
      .subscribe(
        batch => {
          this.processBatch(batch);
        },
        error => { 
          this.errorMessage = <any>error.toString() 
        }
      );
  }

  getLoadCalculatorByJobs(partnership_id: number, jobs: [number]) {
    this.fpoService.getLoadCalculatorByJobs(partnership_id, jobs)
      .subscribe(
        batch => {
          this.processBatch(batch);
        },
        error => { 
          this.errorMessage = <any>error.toString() 
        }
      );
  }

  processBatch(batch): void {
    this.batch = batch;
    this.display = true;
  }
}
