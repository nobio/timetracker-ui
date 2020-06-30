import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreaktimePage } from './breaktime.page';

const routes: Routes = [
  {
    path: '',
    component: BreaktimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreaktimePageRoutingModule {}
