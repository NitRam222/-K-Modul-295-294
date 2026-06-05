import { Component, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {Vehicle} from '../../dataaccess/vehicle';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BaseComponent} from '../../components/base/base.component';
import {VehicleService} from '../../service/vehicle.service';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'app-vehicle-detail',
    templateUrl: './vehicle-detail.component.html',
    styleUrls: ['./vehicle-detail.component.scss'],
    imports: [MatToolbar, MatToolbarRow, MatButton, MatIcon, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, AutofocusDirective, MatHint, MatSelect, MatOption, CdkTextareaAutosize, TranslateModule]
})
export class VehicleDetailComponent extends BaseComponent implements OnInit {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(UntypedFormBuilder);


  vehicle = new Vehicle();
  public objForm = new UntypedFormGroup({
    licence: new UntypedFormControl(''),
    vehicleType: new UntypedFormControl(''),
    description: new UntypedFormControl('')
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.vehicleService.getOne(id).subscribe(obj => {
        this.vehicle = obj;
        this.headerService.setPage('nav.vehicle_edit');
        this.objForm = this.formBuilder.group(obj);
      });
    } else {
      this.headerService.setPage('nav.vehicle_new');
      this.objForm = this.formBuilder.group(this.vehicle);
    }
  }

  async back() {
    await this.router.navigate(['vehicles']);
  }

  async save(formData: any) {
    this.vehicle = Object.assign(formData);

    if (this.vehicle.id) {
      this.vehicleService.update(this.vehicle).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.vehicleService.save(this.vehicle).subscribe({
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
