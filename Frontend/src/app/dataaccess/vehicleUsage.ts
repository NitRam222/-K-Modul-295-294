import {Vehicle} from './vehicle';
import {Employee} from './employee';

export class VehicleUsage {
  public id!: number;
  public fromDate = new Date();
  public toDate = new Date();
  public fromLocation = '';
  public toLocation = '';
  public text = '';
  public km = 0;
  public vehicle = new Vehicle();
  public employee = new Employee();
}
