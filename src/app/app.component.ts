import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import Analytics from '@vercel/analytics';
import { ThemeService } from './services/theme.service';
import { UsageLimitService } from './services/usage-limit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PDF Master Pro Suite';
  private isBrowser: boolean;
  private proModalSub?: Subscription;

  showHelpModal = false;
  showSecurityModal = false;
  showProModal = false;
  showHistoryModal = false;
  showContactModal = false;
  proModalReason: string = '';

  constructor(
    public themeService: ThemeService,
    public usageLimitService: UsageLimitService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      try {
        Analytics.inject();
      } catch (e) {
        // Analytics fallback
      }
    }

    this.proModalSub = this.usageLimitService.proModalTrigger$.subscribe(trigger => {
      if (trigger.open) {
        this.proModalReason = trigger.reason || '';
        this.showProModal = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.proModalSub) {
      this.proModalSub.unsubscribe();
    }
  }

  openHelp(): void {
    this.showHelpModal = true;
  }

  openSecurity(): void {
    this.showSecurityModal = true;
  }

  openHistory(): void {
    this.showHistoryModal = true;
  }

  openContact(): void {
    this.showContactModal = true;
  }

  openPro(reason: string = ''): void {
    this.proModalReason = reason;
    this.showProModal = true;
  }

  closePro(): void {
    this.showProModal = false;
    this.proModalReason = '';
    this.usageLimitService.closeProModal();
  }
}
