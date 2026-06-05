import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priority } from '../../models/priority.model';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="priority-badge" [style.background]="priority?.color || '#4a90e2'">
      {{ priority?.level || 'Priorität' }}
    </span>
  `,
  styles: [
    ".priority-badge { display: inline-flex; padding: 4px 10px; border-radius: 999px; color: #fff; font-size: 0.8rem; text-transform: uppercase; letter-spacing: .04em; }"
  ]
})
export class PriorityBadgeComponent {
  @Input() priority?: Priority;
}
