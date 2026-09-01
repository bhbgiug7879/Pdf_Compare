import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieStorageService } from './cookie-storage.service';

export interface HistoryItem {
  id: string;
  toolSlug: string;
  toolName: string;
  fileName: string;
  fileSizeFormatted: string;
  timestamp: number;
  status: 'completed' | 'failed';
  originalSize?: number;
  newSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private isBrowser: boolean;
  private readonly STORAGE_KEY = 'pdf_history_items';
  private historySubject = new BehaviorSubject<HistoryItem[]>([]);
  public history$: Observable<HistoryItem[]> = this.historySubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cookieStorage: CookieStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadHistory();
    }
  }

  private loadHistory(): void {
    try {
      const items = this.cookieStorage.getObject<HistoryItem[]>(this.STORAGE_KEY);
      if (items && Array.isArray(items)) {
        this.historySubject.next(items);
      }
    } catch (e) {
      console.warn('Could not load history from cookie storage', e);
    }
  }

  public getHistory(): HistoryItem[] {
    return this.historySubject.value;
  }

  public addItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
    const newItem: HistoryItem = {
      ...item,
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now()
    };

    const updated = [newItem, ...this.getHistory()].slice(0, 15); // Store latest 15 operations
    this.historySubject.next(updated);

    if (this.isBrowser) {
      this.cookieStorage.setObject(this.STORAGE_KEY, updated, 30); // 30 days retention
    }
  }

  public removeItem(id: string): void {
    const updated = this.getHistory().filter(item => item.id !== id);
    this.historySubject.next(updated);
    if (this.isBrowser) {
      this.cookieStorage.setObject(this.STORAGE_KEY, updated, 30);
    }
  }

  public clearAll(): void {
    this.historySubject.next([]);
    if (this.isBrowser) {
      this.cookieStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
