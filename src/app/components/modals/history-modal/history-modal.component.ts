import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService, HistoryItem } from '../../../services/history.service';

@Component({
  selector: 'app-history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss']
})
export class HistoryModalComponent {
  @Output() close = new EventEmitter<void>();
  Math = Math;

  constructor(
    public historyService: HistoryService,
    private router: Router
  ) {}

  openTool(slug: string): void {
    this.close.emit();
    this.router.navigate(['/', slug]);
  }

  formatTime(timestamp: number): string {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return new Date(timestamp).toLocaleDateString();
  }
}
