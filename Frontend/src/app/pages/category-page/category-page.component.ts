import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css',
})
export class CategoryPageComponent implements OnInit {
  private readonly service = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);
  categories: Category[] = [];
  newName = '';

  ngOnInit() {
    this.load();
  }

  createCategory() {
    if (!this.newName.trim()) return;
    this.service.create({ name: this.newName.trim() }).subscribe(() => {
      this.newName = '';
      this.load();
    });
  }

  deleteCategory(id?: number) {
    if (id && window.confirm('Löschen?'))
      this.service.delete(id).subscribe(() => this.load());
  }

  private load() {
    this.service.getAll().subscribe((data) => {
      this.categories = data;
      this.cdr.detectChanges();
    });
  }
}
