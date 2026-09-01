import { Component, Input } from '@angular/core';
import { DiffStatus } from '../../models/compare.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() status: DiffStatus | string = 'unchanged';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showIcon: boolean = true;
  @Input() customLabel?: string;

  get statusClass(): string {
    switch (this.status) {
      case 'unchanged':
        return 'badge-unchanged';
      case 'value_changed':
      case 'changed':
        return 'badge-changed';
      case 'added':
        return 'badge-added';
      case 'removed':
        return 'badge-removed';
      case 'label_variation':
        return 'badge-variation';
      default:
        return 'badge-neutral';
    }
  }

  get label(): string {
    if (this.customLabel) return this.customLabel;
    switch (this.status) {
      case 'unchanged':
        return 'Unchanged';
      case 'value_changed':
      case 'changed':
        return 'Value Changed';
      case 'added':
        return 'Added';
      case 'removed':
        return 'Removed';
      case 'label_variation':
        return 'Label Variation';
      default:
        return this.status;
    }
  }
}
