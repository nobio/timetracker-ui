import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsPage } from './stats.page';

const routes: Routes = [
  {
    path: '',
    component: StatsPage,
  },
  {
    path: 'breaktime',
    loadChildren: () => import('./breaktime/breaktime.module').then( m => m.BreaktimePageModule)
  },
  {
    path: 'come-go',
    loadChildren: () => import('./come-go/come-go.module').then( m => m.ComeGoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsPageRoutingModule {}
