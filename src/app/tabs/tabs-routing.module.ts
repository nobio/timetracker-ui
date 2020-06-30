import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'entries',
        loadChildren: () => import('./entries/entries.module').then(m => m.EntriesPageModule)
      },
      {
        path: 'entries/:id',
        loadChildren: () => import('./entries/entry/entry.module').then(m => m.EntryPageModule)
      },
      {
        path: 'entries/:id/map',
        loadChildren: () => import('./entries/map/map.module').then(m => m.MapPageModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('./stats/stats.module').then(m => m.StatsPageModule)
      },
      {
        path: 'breaktime',
        loadChildren: () => import('./stats/breaktime/breaktime.module').then(m => m.BreaktimePageModule)
      },
      {
        path: 'pause',
        loadChildren: () => import('./stats/come-go/come-go.module').then(m => m.ComeGoPageModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/entries',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/entries',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
