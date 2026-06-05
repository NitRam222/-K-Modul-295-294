import { Category } from './category.model';
import { Priority } from './priority.model';
import { User } from './user.model';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  category?: Category;
  priority?: Priority;
  user?: User;
  owner?: User;
  dueDate?: string;
}
