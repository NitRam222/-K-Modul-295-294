import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import {HeaderService} from '../../service/header.service';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {Department} from '../../dataaccess/department';
import {DepartmentService} from '../../service/department.service';
import {BaseComponent} from '../../components/base/base.component';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-department-list',
    templateUrl: './department-list.component.html',
    styleUrls: ['./department-list.component.scss'],
    imports: [IsInRoleDirective, MatToolbar, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, TranslateModule]
})
export class DepartmentListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  departmentDataSource = new MatTableDataSource<Department>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['name', 'actions'];

  public constructor() {
    const translate = inject(TranslateService);

    super();
    this.translate = translate;

    this.headerService.setPage('nav.departments');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.departmentDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.departmentService.getList().subscribe(obj => {
      this.departmentDataSource.data = obj;
    });
  }

  async edit(e: Department) {
    await this.router.navigate(['department', e.id]);
  }

  async add() {
    await this.router.navigate(['department']);
  }

  delete(e: Department) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.departmentService.delete(e.id).subscribe({
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
