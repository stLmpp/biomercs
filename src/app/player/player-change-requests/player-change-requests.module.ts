import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerChangeRequestsRoutingModule } from './player-change-requests-routing.module';
import { PlayerChangeRequestsComponent } from './player-change-requests.component';

@NgModule({
  declarations: [PlayerChangeRequestsComponent],
  imports: [CommonModule, PlayerChangeRequestsRoutingModule],
})
export class PlayerChangeRequestsModule {}
