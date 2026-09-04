import { Component, EventEmitter, Input, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieStorageService } from '../../../services/cookie-storage.service';
import { FirebaseLicenseService, PendingProRequest, ProLicenseRecord, PricingPlan } from '../../../services/firebase-license.service';

export type ProModalStep = 'details' | 'payment' | 'pending_approval' | 'enter_key' | 'activated';

@Component({
  selector: 'app-pro-modal',
  templateUrl: './pro-modal.component.html',
  styleUrls: ['./pro-modal.component.scss']
})
export class ProModalComponent implements OnInit {
  @Input() triggerReason: string = '';
  @Output() close = new EventEmitter<void>();
  isBrowser: boolean;

  // Step state
  currentStep: ProModalStep = 'details';

  // Bank & UPI Details
  upiId: string = 'suryarathiga111@oksbi';
  payeeName: string = 'Suryarathiga';
  proPriceInr: number = 299;
  supportEmail: string = 'devsurya8470@gmail.com';

  // Dynamic Plans from Firebase
  availablePlans: PricingPlan[] = [];
  selectedPlanId: string = 'pro_lifetime';

  // Step 1: User Details
  userName: string = '';
  userEmail: string = '';
  userPhone: string = '';
  userCompany: string = '';
  detailsError: string | null = null;

  // Step 2: Payment & UTR
  enteredUtr: string = '';
  utrError: string | null = null;
  paymentSubmitting: boolean = false;

  // Step 3: Pending Request State
  pendingRequest: PendingProRequest | null = null;

  // Step 4: Strict License Key
  enteredKey: string = '';
  keyError: string | null = null;
  keySubmitting: boolean = false;

  // Admin Quick Verification (For Admin / Surya)
  showAdminLogin: boolean = false;
  adminPasscode: string = '';
  adminError: string | null = null;

  // Storage Keys
  private readonly PRO_ACTIVE_KEY = 'pdfcompare_pro_active';
  private readonly PRO_LICENSE_KEY = 'pdfcompare_license_key';

  get upiPaymentString(): string {
    return `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(this.payeeName)}&am=${this.proPriceInr}&cu=INR&tn=PDFMasterPro_${this.pendingRequest?.requestId || 'Upgrade'}`;
  }

  get dynamicQrUrl(): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(this.upiPaymentString)}`;
  }

  get emailVerificationUrl(): string {
    const reqId = this.pendingRequest?.requestId || 'REQ-' + Math.floor(100000 + Math.random() * 900000);
    const name = this.userName || this.pendingRequest?.userName || 'User';
    const email = this.userEmail || this.pendingRequest?.userEmail || 'N/A';
    const utr = this.enteredUtr || this.pendingRequest?.utrNumber || '[UTR Number]';

    const subject = encodeURIComponent(`PDF Master Pro — Payment Approval Request (${reqId})`);
    const body = encodeURIComponent(
      `PDF MASTER PRO — PAYMENT APPROVAL REQUEST\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Payee: ${this.payeeName} (${this.upiId})\n` +
      `• Amount Paid: ₹${this.proPriceInr}\n` +
      `• Bank 12-Digit UTR: ${utr}\n` +
      `• User Name: ${name}\n` +
      `• Email: ${email}\n` +
      `• Request ID: ${reqId}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Surya, I have completed the ₹${this.proPriceInr} UPI payment. Please verify the credit in your account and approve my Pro License Key.`
    );
    return `mailto:${this.supportEmail}?subject=${subject}&body=${body}`;
  }

  get whatsAppVerificationUrl(): string {
    return this.emailVerificationUrl;
  }

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cookieStorage: CookieStorageService,
    private licenseService: FirebaseLicenseService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const isPro = this.cookieStorage.getItem(this.PRO_ACTIVE_KEY) === 'true';
      if (isPro) {
        this.currentStep = 'activated';
        return;
      }
    }

    // Load available active pricing plans
    this.licenseService.getAllPlans().subscribe({
      next: (plansMap) => {
        if (plansMap && typeof plansMap === 'object') {
          this.availablePlans = Object.values(plansMap)
            .filter(p => p.isActive)
            .sort((a, b) => a.amount - b.amount);

          const defaultPlan = this.availablePlans.find(p => p.id === 'pro_lifetime') || this.availablePlans[0];
          if (defaultPlan) {
            this.selectedPlanId = defaultPlan.id;
            this.proPriceInr = defaultPlan.amount;
          }
        }
      }
    });
  }

  selectPlan(plan: PricingPlan): void {
    this.selectedPlanId = plan.id;
    this.proPriceInr = plan.amount;
  }

  // STEP 1 -> STEP 2: Validate User Details
  proceedToPayment(): void {
    this.detailsError = null;
    const cleanName = this.userName.trim();
    const cleanEmail = this.userEmail.trim();
    const cleanPhone = this.userPhone.trim();

    if (!cleanName || cleanName.length < 2) {
      this.detailsError = 'Please enter your full name.';
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      this.detailsError = 'Please enter a valid email address for license delivery.';
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      this.detailsError = 'Please enter a valid 10-digit WhatsApp/phone number.';
      return;
    }

    this.currentStep = 'payment';
  }

  // STEP 2 -> STEP 3: Submit UTR for Admin Verification in Firebase Database
  submitUtrForApproval(): void {
    this.utrError = null;
    const cleanUtr = this.enteredUtr.trim();

    if (!cleanUtr || cleanUtr.length < 8) {
      this.utrError = 'Please enter a valid 12-digit Bank UTR / Transaction Reference number.';
      return;
    }

    this.paymentSubmitting = true;

    const matchedPlan = this.availablePlans.find(p => p.id === this.selectedPlanId);
    const reqId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);
    const newRequest: PendingProRequest = {
      requestId: reqId,
      userName: this.userName.trim(),
      userEmail: this.userEmail.trim(),
      userPhone: this.userPhone.trim(),
      userCompany: this.userCompany.trim() || undefined,
      utrNumber: cleanUtr,
      amount: this.proPriceInr,
      submittedAt: Date.now(),
      status: 'pending_admin_approval',
      planId: this.selectedPlanId,
      billingInterval: matchedPlan?.billingInterval || 'lifetime'
    };

    // Store in Firebase Realtime Database directly (No cookies/localStorage)
    this.licenseService.submitPaymentRequest(newRequest).subscribe({
      next: () => {
        this.paymentSubmitting = false;
        this.pendingRequest = newRequest;
        this.currentStep = 'pending_approval';
      },
      error: () => {
        this.paymentSubmitting = false;
        this.pendingRequest = newRequest;
        this.currentStep = 'pending_approval';
      }
    });
  }

  // STRICT LICENSE KEY ACTIVATION (Database-backed only - NO dummy keys!)
  async activateLicenseKey(): Promise<void> {
    this.keyError = null;
    const key = this.enteredKey.trim().toUpperCase();

    if (!key) {
      this.keyError = 'Please enter your license key.';
      return;
    }

    if (key.length < 8) {
      this.keyError = '❌ Invalid key format. Pro keys are minimum 8 characters.';
      return;
    }

    this.keySubmitting = true;

    try {
      // Query Firebase Database for strict verification with user uniqueness check
      const result = await this.licenseService.validateAndActivateLicense(key, {
        userName: this.userName,
        userEmail: this.userEmail,
        userPhone: this.userPhone
      });
      this.keySubmitting = false;

      if (result.valid) {
        this.currentStep = 'activated';
      } else {
        this.keyError = result.message;
      }
    } catch (err: any) {
      this.keySubmitting = false;
      this.keyError = '❌ License verification error. Please check your internet connection or contact Admin Surya.';
    }
  }

  // ADMIN APPROVAL ACTION (For Owner / Surya)
  verifyAdminPasscode(): void {
    this.adminError = null;
    const pass = this.adminPasscode.trim();

    if (pass === 'Surya@2000' || pass === 'techiesurya') {
      const adminKey = `PDFPRO-SURYA-${Date.now().toString().slice(-6)}`;
      
      const adminLicense: ProLicenseRecord = {
        licenseKey: adminKey,
        userName: this.userName || 'Admin Surya',
        userEmail: this.userEmail || 'devsurya8470@gmail.com',
        userPhone: this.userPhone || '',
        plan: 'pro_lifetime',
        amount: 299,
        status: 'active',
        createdAt: Date.now(),
        activatedCount: 1,
        maxActivations: 10,
        notes: 'Owner bypass via Admin PIN'
      };

      // Register official license in database
      this.licenseService.saveLicense(adminLicense).subscribe();

      if (this.isBrowser) {
        this.cookieStorage.setItem(this.PRO_ACTIVE_KEY, 'true', 365);
        this.cookieStorage.setItem(this.PRO_LICENSE_KEY, adminKey, 365);
      }
      this.currentStep = 'activated';
    } else {
      this.adminError = 'Incorrect Admin Passcode.';
    }
  }

  editUserDetails(): void {
    this.currentStep = 'details';
  }

  openKeyEntry(): void {
    this.currentStep = 'enter_key';
  }
}
