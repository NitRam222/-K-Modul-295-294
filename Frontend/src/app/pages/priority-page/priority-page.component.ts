import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PriorityService } from '../../services/priority.service';
import { Priority } from '../../models/priority.model';

@Component({
  selector: 'app-priority-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './priority-page.component.html',
  styleUrl: './priority-page.component.css',
})
export class PriorityPageComponent implements OnInit {
  private readonly service = inject(PriorityService);
  private readonly cdr = inject(ChangeDetectorRef);
  priorities: Priority[] = [];
  newName = '';

  ngOnInit() {
    this.load();
  }

  create() {
    if (!this.newName.trim()) return;
    this.service.create({ level: this.newName.trim() }).subscribe(() => {
      this.newName = '';
      this.load();
    });
  }

  deletePriority(id?: number) {
    if (id && window.confirm('Löschen?'))
      this.service.delete(id).subscribe(() => this.load());
  }

  private load() {
    this.service.getAll().subscribe((data) => {
      this.priorities = data;
      this.cdr.detectChanges();
    });
  }
}
