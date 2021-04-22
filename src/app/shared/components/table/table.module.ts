import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { TableCellComponent } from './table-cell/table-cell.component';
import { PortalModule } from '@angular/cdk/portal';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { TableCellFormatterPipe } from './table-cell-formatter.pipe';

@NgModule({
  declarations: [TableComponent, TableCellComponent, TableCellFormatterPipe],
  imports: [
    CommonModule,
    CardModule,
    PaginationModule,
    SpinnerModule,
    IconModule,
    NgLetModule,
    PortalModule,
    TooltipModule,
  ],
  exports: [TableComponent],
})
export class TableModule {}
