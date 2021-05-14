import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutPage as AboutPage } from './about.page';

import { AboutPageRoutingModule } from './about-routing.module';
import { OnlineStatusComponentModule } from '../../components/online-status/online-status.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnlineStatusComponentModule,
    AboutPageRoutingModule
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {}
