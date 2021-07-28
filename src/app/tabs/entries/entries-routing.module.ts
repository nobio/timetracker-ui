import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntriesPage } from './entries.page';

const routes: Routes = [
  {
    path: '',
    component: EntriesPage,
  },
  {
    path: 'entries/:id',
    loadChildren: () =>
      import('./entry/entry.module').then((m) => m.EntryPageModule),
  },
  {
    path: 'entries/:id/map',
    loadChildren: () => import('./map/map.module').then((m) => m.MapPageModule),
  },
  {
    path: 'fails',
    loadChildren: () =>
      import('./fails/fails.module').then((m) => m.FailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntriesPageRoutingModule {}
