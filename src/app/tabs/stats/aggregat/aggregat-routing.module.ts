import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggregatPage } from './aggregat.page';

const routes: Routes = [
  {
    path: '',
    component: AggregatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregatPageRoutingModule {}
