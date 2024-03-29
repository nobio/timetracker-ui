import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
  },
  {
    path: 'user',
    loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule)
  },
  {
    path: 'user/:id',
    loadChildren: () => import('./user/user.module').then(m => m.UserPageModule)
  },
  {
    path: 'geofence',
    loadChildren: () => import('./geofences/geofences.module').then(m => m.GeofencesPageModule)
  }, {
    path: 'geofence/:id',
    loadChildren: () => import('./geofence/geofence.module').then(m => m.GeofencePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }
