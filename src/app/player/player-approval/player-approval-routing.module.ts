import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerApprovalComponent } from './player-approval.component';

const routes: Routes = [
  {
    path: '',
    component: PlayerApprovalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerApprovalRoutingModule {}
