import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="category-badge" [style.background]="category?.color || '#5a5a5a'">
      {{ category?.name || 'Kategorie' }}
    </span>
  `,
  styles: [
    ".category-badge { display: inline-flex; padding: 4px 10px; border-radius: 999px; color: #fff; font-size: 0.8rem; text-transform: uppercase; letter-spacing: .04em; }"
  ]
})
export class CategoryBadgeComponent {
  @Input() category?: Category;
}
