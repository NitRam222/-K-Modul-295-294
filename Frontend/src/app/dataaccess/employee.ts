import {Department} from './department';

export class Employee {
  public id!: number;
  public badge = '';
  public name = '';
  public firstname = '';
  public department = new Department();
}
