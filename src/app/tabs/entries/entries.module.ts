import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EntriesPage as AboutPage } from './entries.page';
import { OnlineStatusComponent } from 'src/app/components/online-status/online-status.component';
import { EntriesPageRoutingModule } from './entries-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnlineStatusComponent,
    EntriesPageRoutingModule,
    AboutPage
  ],
})
export class EntriesPageModule { }
