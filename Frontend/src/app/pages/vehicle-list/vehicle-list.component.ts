import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import {Vehicle} from '../../dataaccess/vehicle';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HeaderService} from '../../service/header.service';
import {Router} from '@angular/router';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import {BaseComponent} from '../../components/base/base.component';
import {VehicleService} from '../../service/vehicle.service';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'app-vehicle-list',
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.scss'],
    imports: [IsInRoleDirective, MatToolbar, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, TranslateModule]
})
export class VehicleListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private vehicleService = inject(VehicleService);
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  vehicleDataSource = new MatTableDataSource<Vehicle>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['vehicleType', 'licence', 'description', 'actions'];

  public constructor() {
    super();

    this.headerService.setPage('nav.vehicles');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.vehicleDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.vehicleService.getList().subscribe(obj => {
      this.vehicleDataSource.data = obj;
    });
  }

  async edit(e: Vehicle) {
    await this.router.navigate(['vehicle', e.id]);
  }

  async add() {
    await this.router.navigate(['vehicle']);
  }

  delete(e: Vehicle) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.vehicleService.delete(e.id).subscribe({
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
