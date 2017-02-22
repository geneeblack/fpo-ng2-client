import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'

import { LoadsComponent } from './loads/loads.component';
import { LoadCalculatorComponent } from './load-calculator.component';
import { MasterLoadingSummaryComponent } from './master-loading-summary/master-loading-summary.component';
import { PilotDeleteDialogComponent } from './pilot-delete-dialog/pilot-delete-dialog.component';
import { PilotDialogComponent } from './pilot-dialog/pilot-dialog.component';
import { PilotSummaryFullComponent } from './pilot-summary-full/pilot-summary-full.component';
import { PilotSummaryEqualComponent } from './pilot-summary-equal/pilot-summary-equal.component';

import { UnitPartialsPipe, DryPilotsPipe, LiquidPilotsPipe } from '../load-calculator/utility/pipes'

import { CapitalizePipe } from 'angular-pipes/src/string/capitalize.pipe';
import { FloorPipe } from 'angular-pipes/src/math/floor.pipe';
import { RoundPipe } from 'angular-pipes/src/math/round.pipe';


@NgModule({
  declarations: [
    LoadsComponent,
    LoadCalculatorComponent,
    MasterLoadingSummaryComponent,
    PilotDeleteDialogComponent,
    PilotDialogComponent,
    PilotSummaryFullComponent,
    PilotSummaryEqualComponent,
    FloorPipe,
    RoundPipe,
    UnitPartialsPipe,
    CapitalizePipe,
    DryPilotsPipe,
    LiquidPilotsPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CustomFormsModule
  ],
})
export class LoadCalculatorModule { }
