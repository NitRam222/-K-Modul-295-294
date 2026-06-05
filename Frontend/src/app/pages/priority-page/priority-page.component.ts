import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PriorityService } from '../../services/priority.service';
import { Priority } from '../../models/priority.model';

@Component({
  selector: 'app-priority-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <div>
          <h1>Prioritäten</h1>
          <p>Definieren Sie Prioritäten für Ihre Aufgaben.</p>
        </div>
      </div>
      <form class="inline-form" (ngSubmit)="createPriority()">
        <input [(ngModel)]="newPriorityName" name="priorityLevel" placeholder="Neue Prioritätsstufe" required />
        <button type="submit">Hinzufügen</button>
      </form>
      <ul class="list">
        <li *ngFor="let priority of priorities">
          <span>{{ priority.level }}</span>
          <button class="danger" (click)="deletePriority(priority.id)">Löschen</button>
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
export class PriorityPageComponent implements OnInit {
  priorities: Priority[] = [];
  newPriorityName = '';

  constructor(private priorityService: PriorityService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPriorities();
  }

  createPriority(): void {
    if (!this.newPriorityName.trim()) {
      return;
    }
    this.priorityService.create({ level: this.newPriorityName.trim() }).subscribe(() => {
      this.newPriorityName = '';
      this.loadPriorities();
    });
  }

  deletePriority(id?: number): void {
    if (!id || !window.confirm('Priorität wirklich löschen?')) {
      return;
    }
    this.priorityService.delete(id).subscribe(() => this.loadPriorities());
  }

  private loadPriorities(): void {
    this.priorityService.getAll().subscribe((priorities) => {
      this.priorities = priorities;
      this.cdr.detectChanges();
    });
  }
}
