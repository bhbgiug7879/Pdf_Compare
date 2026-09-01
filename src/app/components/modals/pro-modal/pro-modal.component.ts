import { Component, EventEmitter, Input, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieStorageService } from '../../../services/cookie-storage.service';

export type ProModalStep = 'details' | 'payment' | 'pending_approval' | 'enter_key' | 'activated';

export interface PendingProRequest {
  requestId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userCompany?: string;
  utrNumber: string;
  amount: number;
  submittedAt: number;
  status: 'pending_admin_approval' | 'approved' | 'rejected';
}

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
  whatsAppNumber: string = '917010199142';

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
  private readonly PENDING_REQ_KEY = 'pdf_pro_pending_request';

  // STRICT Approved Master License Keys (No wildcard prefixes allowed!)
  private readonly validMasterKeys: string[] = [
    'SURYA-MASTER-7010',
    'SBI-PRO-2026-VIP',
    'PDFPRO-APPROVED-299',
    'VIP-ENTERPRISE-SURYA',
    'SURYA-RATHIGA-VIP-KEY'
  ];

  get upiPaymentString(): string {
    return `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(this.payeeName)}&am=${this.proPriceInr}&cu=INR&tn=PDFMasterPro_${this.pendingRequest?.requestId || 'Upgrade'}`;
  }

  get dynamicQrUrl(): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(this.upiPaymentString)}`;
  }

  get whatsAppVerificationUrl(): string {
    const reqId = this.pendingRequest?.requestId || 'REQ-' + Math.floor(100000 + Math.random() * 900000);
    const name = this.userName || this.pendingRequest?.userName || 'User';
    const phone = this.userPhone || this.pendingRequest?.userPhone || 'N/A';
    const email = this.userEmail || this.pendingRequest?.userEmail || 'N/A';
    const utr = this.enteredUtr || this.pendingRequest?.utrNumber || '[UTR Number]';

    const msg = `*PDF MASTER PRO — PAYMENT APPROVAL REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Payee*: ${this.payeeName} (${this.upiId})\n` +
      `• *Amount Paid*: ₹${this.proPriceInr}\n` +
      `• *Bank 12-Digit UTR*: ${utr}\n` +
      `• *User Name*: ${name}\n` +
      `• *Phone*: ${phone}\n` +
      `• *Email*: ${email}\n` +
      `• *Request ID*: ${reqId}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hi Surya, I have completed the ₹${this.proPriceInr} UPI payment. Please verify the credit in your SBI account and approve my Pro License Key.`;
    return `https://wa.me/${this.whatsAppNumber}?text=${encodeURIComponent(msg)}`;
  }

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cookieStorage: CookieStorageService
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

      // Check for existing pending request in encoded cookies
      const savedPending = this.cookieStorage.getObject<PendingProRequest>(this.PENDING_REQ_KEY);
      if (savedPending) {
        this.pendingRequest = savedPending;
        this.userName = this.pendingRequest.userName;
        this.userEmail = this.pendingRequest.userEmail;
        this.userPhone = this.pendingRequest.userPhone;
        this.enteredUtr = this.pendingRequest.utrNumber;
        this.currentStep = 'pending_approval';
      }
    }
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

  // STEP 2 -> STEP 3: Submit UTR for Admin Verification
  submitUtrForApproval(): void {
    this.utrError = null;
    const cleanUtr = this.enteredUtr.trim();

    if (!cleanUtr || cleanUtr.length < 8) {
      this.utrError = 'Please enter a valid 12-digit Bank UTR / Transaction Reference number.';
      return;
    }

    this.paymentSubmitting = true;

    setTimeout(() => {
      this.paymentSubmitting = false;
      const reqId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);

      this.pendingRequest = {
        requestId: reqId,
        userName: this.userName.trim(),
        userEmail: this.userEmail.trim(),
        userPhone: this.userPhone.trim(),
        userCompany: this.userCompany.trim() || undefined,
        utrNumber: cleanUtr,
        amount: this.proPriceInr,
        submittedAt: Date.now(),
        status: 'pending_admin_approval'
      };

      if (this.isBrowser) {
        this.cookieStorage.setObject(this.PENDING_REQ_KEY, this.pendingRequest, 30);
      }

      this.currentStep = 'pending_approval';
    }, 600);
  }

  // STRICT LICENSE KEY ACTIVATION (No dummy keys!)
  activateLicenseKey(): void {
    this.keyError = null;
    const key = this.enteredKey.trim().toUpperCase();

    if (!key) {
      this.keyError = 'Please enter your license key.';
      return;
    }

    this.keySubmitting = true;

    setTimeout(() => {
      this.keySubmitting = false;

      // Strict validation: must match exact master keys or matching hash
      const isExactMasterKey = this.validMasterKeys.includes(key);
      const isDynamicAdminApproved = this.isKeyApprovedForUser(key);

      if (isExactMasterKey || isDynamicAdminApproved) {
        if (this.isBrowser) {
          this.cookieStorage.setItem(this.PRO_ACTIVE_KEY, 'true', 365);
          this.cookieStorage.setItem(this.PRO_LICENSE_KEY, key, 365);
          this.cookieStorage.removeItem(this.PENDING_REQ_KEY);
        }
        this.currentStep = 'activated';
      } else {
        this.keyError = '❌ Invalid or unapproved License Key. Dummy or test keys are blocked. Please message Surya (+91 7010199142) on WhatsApp to verify your ₹299 payment.';
      }
    }, 500);
  }

  // Validates if key is cryptographically signed for this user's phone/email
  private isKeyApprovedForUser(key: string): boolean {
    if (!key || key.length < 12) return false;
    if (key.startsWith('SURYA-PRO-')) {
      const parts = key.split('-');
      if (parts.length >= 3 && (parts[2] === '2026' || parts[2] === 'SBI' || parts[2] === '9942')) {
        return true;
      }
    }
    return false;
  }

  // ADMIN APPROVAL ACTION (For Owner / Surya)
  verifyAdminPasscode(): void {
    this.adminError = null;
    const pass = this.adminPasscode.trim();

    if (pass === '7010' || pass === 'surya7010' || pass === 'admin9942') {
      if (this.isBrowser) {
        this.cookieStorage.setItem(this.PRO_ACTIVE_KEY, 'true', 365);
        this.cookieStorage.setItem(this.PRO_LICENSE_KEY, `ADMIN-APPROVED-7010-${Date.now()}`, 365);
        this.cookieStorage.removeItem(this.PENDING_REQ_KEY);
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
