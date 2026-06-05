import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-dialog">
      <p>{{ message }}</p>
      <div class="dialog-actions">
        <button type="button" (click)="cancel.emit()">Abbrechen</button>
        <button type="button" class="danger" (click)="confirm.emit()">Bestätigen</button>
      </div>
    </div>
  `,
  styles: [
    ".confirm-dialog { background: #fff; border-radius: 8px; padding: 16px; box-shadow: 0 3px 14px rgba(0,0,0,0.12); max-width: 320px; }",
    ".dialog-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }",
    "button { border: none; cursor: pointer; padding: 10px 16px; border-radius: 4px; font: inherit; }",
    "button.danger { background: #e63946; color: #fff; }",
    "button:not(.danger) { background: #adb5bd; color: #1f2937; }"
  ]
})
export class ConfirmDialogComponent {
  @Input() message = 'Möchten Sie fortfahren?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
