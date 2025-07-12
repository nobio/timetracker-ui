import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AboutPage } from './about.page';
import { OnlineStatusComponent } from 'src/app/components/online-status/online-status.component';
import { AboutPageRoutingModule } from './about-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnlineStatusComponent,
    AboutPageRoutingModule,
    AboutPage
  ]
})
export class AboutPageModule { }
