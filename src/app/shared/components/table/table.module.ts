import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { NgLetModule } from '@stlmpp/utils';
import { TableCellComponent } from './table-cell/table-cell.component';
import { PortalModule } from '@angular/cdk/portal';
import { TableCellFormatterPipe } from './table-cell-formatter.pipe';
import { TableCellTooltipPipe } from './table-cell-tooltip.pipe';

const DECLARATIONS = [TableComponent, TableCellComponent, TableCellFormatterPipe, TableCellTooltipPipe];
const MODULES = [CommonModule, CardModule, PaginationModule, NgLetModule, PortalModule];
const EXPORTS = [TableComponent, CommonModule, CardModule, PaginationModule, NgLetModule, PortalModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...EXPORTS],
})
export class TableModule {}
