import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieStorageService } from './cookie-storage.service';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject: BehaviorSubject<AppTheme>;
  public currentTheme$: Observable<AppTheme>;
  private isBrowser: boolean;
  private readonly THEME_KEY = 'pdf_app_theme';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cookieStorage: CookieStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    let initialTheme: AppTheme = 'dark'; // Default dark mode

    if (this.isBrowser) {
      const saved = this.cookieStorage.getItem(this.THEME_KEY) as AppTheme;
      if (saved === 'dark' || saved === 'light') {
        initialTheme = saved;
      }
    }

    this.themeSubject = new BehaviorSubject<AppTheme>(initialTheme);
    this.currentTheme$ = this.themeSubject.asObservable();

    if (this.isBrowser) {
      this.applyThemeToDom(initialTheme);
    }
  }

  public get theme(): AppTheme {
    return this.themeSubject.value;
  }

  public setTheme(theme: AppTheme): void {
    if (this.isBrowser) {
      this.cookieStorage.setItem(this.THEME_KEY, theme, 365);
      this.applyThemeToDom(theme);
    }
    this.themeSubject.next(theme);
  }

  public toggleTheme(): void {
    const nextTheme: AppTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  private applyThemeToDom(theme: AppTheme): void {
    if (!this.isBrowser) return;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }
}
