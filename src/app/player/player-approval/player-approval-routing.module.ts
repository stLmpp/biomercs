import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerApprovalComponent } from './player-approval.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';

const routes: Routes = [
  {
    path: '',
    component: PlayerApprovalComponent,
    resolve: [PlatformResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerApprovalRoutingModule {}
