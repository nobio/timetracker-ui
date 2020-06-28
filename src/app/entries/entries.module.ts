import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntriesPage as AboutPage } from './entries.page';

import { EntriesPageRoutingModule } from './entries-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EntriesPageRoutingModule
  ],
  declarations: [AboutPage]
})
export class EntriesPageModule {}
