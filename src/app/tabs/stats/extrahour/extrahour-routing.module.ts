import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtrahourPage } from './extrahour.page';

const routes: Routes = [
  {
    path: '',
    component: ExtrahourPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtrahourPageRoutingModule {}
