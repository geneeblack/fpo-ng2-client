import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoadCalculatorModule } from './load-calculator/load-calculator.module';

import { FPOService } from './services/fpo.service';
import { AppRoutingModule }     from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    HttpModule,
    AppRoutingModule,
    LoadCalculatorModule
  ],
  providers: [FPOService],
  bootstrap: [AppComponent]
})
export class AppModule { }
