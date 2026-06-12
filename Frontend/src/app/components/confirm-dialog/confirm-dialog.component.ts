import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm">
      <p>{{ message }}</p>
      <div class="actions">
        <button (click)="cancelAction.emit()">Nein</button>
        <button class="danger" (click)="confirm.emit()">Ja</button>
      </div>
    </div>
  `,
  styles: [
    '.confirm { background: #fff; border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }',
    '.actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }',
    'button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }',
    '.danger { background: #e63946; color: #fff; }',
  ],
})
export class ConfirmDialogComponent {
  @Input() message = 'Sicher?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancelAction = new EventEmitter<void>();
}
