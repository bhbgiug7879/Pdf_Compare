import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieStorageService } from './cookie-storage.service';

export interface UsageState {
  isPro: boolean;
  dailyOperationsCount: number;
  dailyLimit: number;
  maxFileSizeMbFree: number;
  maxFileSizeMbPro: number;
  maxBatchFilesFree: number;
  maxBatchFilesPro: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsageLimitService {
  private isBrowser: boolean;
  public readonly PRO_PRICE_INR = 299;
  public readonly FREE_DAILY_LIMIT = 5;
  public readonly FREE_MAX_FILE_SIZE_MB = 15;
  public readonly PRO_MAX_FILE_SIZE_MB = 250;
  public readonly FREE_MAX_BATCH_FILES = 2;
  public readonly PRO_MAX_BATCH_FILES = 50;

  private readonly PRO_ACTIVE_KEY = 'pdfcompare_pro_active';
  private readonly USAGE_DATE_KEY = 'pdf_usage_date';
  private readonly USAGE_COUNT_KEY = 'pdf_usage_count';

  private proModalTriggerSubject = new BehaviorSubject<{ open: boolean; reason?: string }>({ open: false });
  public proModalTrigger$: Observable<{ open: boolean; reason?: string }> = this.proModalTriggerSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cookieStorage: CookieStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public isPro(): boolean {
    if (!this.isBrowser) return false;
    return this.cookieStorage.getItem(this.PRO_ACTIVE_KEY) === 'true';
  }

  public getDailyUsageCount(): number {
    if (!this.isBrowser) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = this.cookieStorage.getItem(this.USAGE_DATE_KEY);
    if (savedDate !== today) {
      this.cookieStorage.setItem(this.USAGE_DATE_KEY, today, 7);
      this.cookieStorage.setItem(this.USAGE_COUNT_KEY, '0', 7);
      return 0;
    }
    return parseInt(this.cookieStorage.getItem(this.USAGE_COUNT_KEY) || '0', 10);
  }

  public incrementDailyUsage(): void {
    if (!this.isBrowser || this.isPro()) return;
    const current = this.getDailyUsageCount();
    this.cookieStorage.setItem(this.USAGE_COUNT_KEY, (current + 1).toString(), 7);
  }

  public checkCanPerformTask(fileCount: number = 1, maxFileSizeBytes: number = 0): { allowed: boolean; reason?: string } {
    if (this.isPro()) {
      return { allowed: true };
    }

    // 1. Check Batch Count Limit
    if (fileCount > this.FREE_MAX_BATCH_FILES) {
      const msg = `Batch limit reached: Free plan allows up to ${this.FREE_MAX_BATCH_FILES} files. Upgrade to Pro for ₹${this.PRO_PRICE_INR} for unlimited batch processing!`;
      return { allowed: false, reason: msg };
    }

    // 2. Check File Size Limit
    const maxFileSizeMb = maxFileSizeBytes / (1024 * 1024);
    if (maxFileSizeMb > this.FREE_MAX_FILE_SIZE_MB) {
      const msg = `File size limit reached: File (${maxFileSizeMb.toFixed(1)} MB) exceeds the free ${this.FREE_MAX_FILE_SIZE_MB} MB limit. Upgrade to Pro for ₹${this.PRO_PRICE_INR} for large files up to ${this.PRO_MAX_FILE_SIZE_MB} MB!`;
      return { allowed: false, reason: msg };
    }

    // 3. Check Daily Usage Limit
    const currentUsage = this.getDailyUsageCount();
    if (currentUsage >= this.FREE_DAILY_LIMIT) {
      const msg = `Daily limit reached: You have completed ${currentUsage} free tasks today. Upgrade to Pro for ₹${this.PRO_PRICE_INR} to unlock lifetime unlimited tasks!`;
      return { allowed: false, reason: msg };
    }

    return { allowed: true };
  }

  public triggerProModal(reason?: string): void {
    this.proModalTriggerSubject.next({ open: true, reason });
  }

  public closeProModal(): void {
    this.proModalTriggerSubject.next({ open: false });
  }
}
