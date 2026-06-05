import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <div>
          <h1>Kategorien</h1>
          <p>Verwalten Sie Kategorien für Ihre Aufgaben.</p>
        </div>
      </div>
      <form class="inline-form" (ngSubmit)="createCategory()">
        <input [(ngModel)]="newCategoryName" name="categoryName" placeholder="Neue Kategorie" required />
        <button type="submit">Hinzufügen</button>
      </form>
      <ul class="list">
        <li *ngFor="let category of categories">
          <span>{{ category.name }}</span>
          <button class="danger" (click)="deleteCategory(category.id)">Löschen</button>
        </li>
      </ul>
    </section>
  `,
  styles: [
    ".inline-form { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }",
    "input { flex: 1; min-width: 240px; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; }",
    "button { background: #457b9d; color: #fff; border: none; padding: 12px 18px; border-radius: 10px; cursor: pointer; }",
    ".list { list-style: none; padding: 0; margin: 0; }",
    ".list li { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 14px 18px; border-radius: 14px; box-shadow: 0 5px 16px rgba(15,23,42,0.06); margin-bottom: 12px; }",
    ".danger { background: #e63946; }"
  ]
})
export class CategoryPageComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName = '';

  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) {
      return;
    }
    this.categoryService.create({ name: this.newCategoryName.trim() }).subscribe(() => {
      this.newCategoryName = '';
      this.loadCategories();
    });
  }

  deleteCategory(id?: number): void {
    if (!id || !window.confirm('Kategorie wirklich löschen?')) {
      return;
    }
    this.categoryService.delete(id).subscribe(() => this.loadCategories());
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe((categories) => {
      this.categories = categories;
      this.cdr.detectChanges();
    });
  }
}
