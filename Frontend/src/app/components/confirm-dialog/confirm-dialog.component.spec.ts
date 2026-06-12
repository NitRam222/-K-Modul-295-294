import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show default message', () => {
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('p')).nativeElement
      .textContent;

    expect(message).toContain('Sicher?');
  });

  it('should show custom message', () => {
    component.message = 'Aufgabe wirklich löschen?';

    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('p')).nativeElement
      .textContent;

    expect(message).toContain('Aufgabe wirklich löschen?');
  });

  it('should emit cancel when clicking Nein', () => {
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.cancelAction, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].triggerEventHandler('click', null);

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit confirm when clicking Ja', () => {
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.confirm, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[1].triggerEventHandler('click', null);

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
