import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import {HeaderService} from '../../service/header.service';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {Vehicle} from '../../dataaccess/vehicle';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {VehicleUsage} from '../../dataaccess/vehicleUsage';
import {BaseComponent} from '../../components/base/base.component';
import {VehicleUsageService} from '../../service/vehicle-usage.service';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-vehicle-usage-list',
    templateUrl: './vehicle-usage-list.component.html',
    styleUrls: ['./vehicle-usage-list.component.scss'],
    imports: [IsInRoleDirective, MatToolbar, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, DecimalPipe, DatePipe, TranslateModule]
})
export class VehicleUsageListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private vehicleUsageService = inject(VehicleUsageService);
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  vehicleUsageDataSource = new MatTableDataSource<VehicleUsage>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['fromDate', 'toDate', 'fromLocation', 'toLocation', 'km', 'vehicle', 'employee', 'text', 'actions'];

  public constructor() {
    super();

    this.headerService.setPage('nav.usage');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.vehicleUsageDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.vehicleUsageService.getList().subscribe(obj => {
      this.vehicleUsageDataSource.data = obj;
    });
  }

  async edit(e: Vehicle) {
    await this.router.navigate(['vehicle-usage', e.id]);
  }

  async add() {
    await this.router.navigate(['vehicle-usage']);
  }

  delete(e: VehicleUsage) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.vehicleUsageService.delete(e.id).subscribe({
          next: response => {
            if (response.status === 200) {
              this.snackBar.open(this.deletedMessage, this.closeMessage, {duration: 5000});
              this.reloadData();
            } else {
              this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000});
            }
          },
          error: () => this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000})
        });
      }
    });
  }
}
