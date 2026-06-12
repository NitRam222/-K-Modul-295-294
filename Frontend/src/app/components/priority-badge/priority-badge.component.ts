import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priority } from '../../models/priority.model';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span
    class="badge"
    [style.background]="priority?.color || '#444'"
    >{{ priority?.level || 'Prio' }}</span
  >`,
  styles: [
    '.badge { padding: 4px 10px; border-radius: 99px; color: #fff; font-size: 0.7rem; }',
  ],
})
export class PriorityBadgeComponent {
  @Input() priority?: Priority;
}
