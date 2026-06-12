import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span
    class="badge"
    [style.background]="category?.color || '#555'"
    >{{ category?.name || 'Kat' }}</span
  >`,
  styles: [
    '.badge { padding: 4px 10px; border-radius: 99px; color: #fff; font-size: 0.7rem; }',
  ],
})
export class CategoryBadgeComponent {
  @Input() category?: Category;
}
