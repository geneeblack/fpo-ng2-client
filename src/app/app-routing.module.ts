import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadCalculatorComponent } from './load-calculator/load-calculator.component';

const appRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'applicators/:applicator_id',
        children: [
          {
            path: 'batches/:batch_id',
            children: [
              { path: 'load_calculator', component: LoadCalculatorComponent }
            ]
          }
        ]
      },
      {
        path: 'partnerships/:partnership_id',
        children: [
          {
            path: 'jobs/:jobs',
            children: [
              { path: 'load_calculator', component: LoadCalculatorComponent }
            ]
          }
        ]
      }      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }