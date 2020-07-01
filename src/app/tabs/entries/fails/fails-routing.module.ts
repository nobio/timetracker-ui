import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FailsPage } from './fails.page';

const routes: Routes = [
  {
    path: '',
    component: FailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FailsPageRoutingModule {}
