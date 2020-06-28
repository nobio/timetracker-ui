import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineStatusComponent } from './online-status.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [OnlineStatusComponent],
  exports: [OnlineStatusComponent]
})
export class OnlineStatusComponentModule {}
