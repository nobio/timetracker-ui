import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComeGoPage } from './come-go.page';

const routes: Routes = [
  {
    path: '',
    component: ComeGoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComeGoPageRoutingModule {}
