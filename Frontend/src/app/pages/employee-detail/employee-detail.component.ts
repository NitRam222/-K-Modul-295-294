import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {Employee} from '../../dataaccess/employee';
import {BaseComponent} from '../../components/base/base.component';
import {EmployeeService} from '../../service/employee.service';
import {Department} from '../../dataaccess/department';
import {DepartmentService} from '../../service/department.service';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { MatSelect } from '@angular/material/select';

import { MatOption } from '@angular/material/core';

@Component({
    selector: 'app-employee-detail',
    templateUrl: './employee-detail.component.html',
    styleUrls: ['./employee-detail.component.scss'],
    imports: [MatToolbar, MatToolbarRow, MatButton, MatIcon, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, AutofocusDirective, MatHint, MatSelect, MatOption, TranslateModule]
})
export class EmployeeDetailComponent extends BaseComponent implements OnInit {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(UntypedFormBuilder);
  private departmentService = inject(DepartmentService);


  employee = new Employee();
  departments: Department[] = [];

  public objForm = new UntypedFormGroup({
    badge: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    firstname: new UntypedFormControl(''),
    departmentId: new UntypedFormControl('')
  });

  constructor() {
    const translate = inject(TranslateService);

    super();
  
    this.translate = translate;
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.employeeService.getOne(id).subscribe(obj => {
        this.employee = obj;
        this.headerService.setPage('nav.employee_edit');
        this.objForm = this.formBuilder.group(obj);
        this.objForm.addControl('departmentId', new UntypedFormControl(obj.department.id));
      });
    } else {
      this.headerService.setPage('nav.employee_new');
    }
    this.departmentService.getList().subscribe(obj => {
      this.departments = obj;
    });
  }

  async back() {
    await this.router.navigate(['employees']);
  }

  async save(formData: any) {
    this.employee = Object.assign(formData);

    this.employee.department = this.departments.find(o => o.id === formData.departmentId) as Department;

    if (this.employee.id) {
      this.employeeService.update(this.employee).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.employeeService.save(this.employee).subscribe({
        next: () => {
          this.snackBar.open(this.messageNewSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageNewError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    }
  }

}
