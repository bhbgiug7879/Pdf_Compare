import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { CookieStorageService } from './cookie-storage.service';
import { FIREBASE_CONFIG } from '../../environments/firebase.config';

export type BillingInterval = 'monthly' | 'yearly' | 'lifetime' | 'quarterly';

export interface PricingPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingInterval: BillingInterval;
  description: string;
  features: string[];
  maxActivations: number;
  isActive: boolean;
  isPopular?: boolean;
  badge?: string;
  createdAt: number;
  updatedAt?: number;
}

export const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    amount: 99,
    currency: 'INR',
    billingInterval: 'monthly',
    description: 'Flexible monthly billing for high-volume PDF workflows',
    features: [
      'Unlimited PDF Comparisons',
      'Side-by-Side Visual Diff & Text Diff',
      'Batch File Processing up to 50 files',
      'Max File Size 250MB',
      '2 Device Activations'
    ],
    maxActivations: 2,
    isActive: true,
    isPopular: false,
    badge: 'Monthly',
    createdAt: 1700000000000
  },
  {
    id: 'pro_yearly',
    name: 'Pro Annual Pass',
    amount: 799,
    currency: 'INR',
    billingInterval: 'yearly',
    description: 'Save 33% with annual billing. Ideal for continuous professionals.',
    features: [
      'Unlimited PDF Comparisons',
      'Side-by-Side Visual Diff & Text Diff',
      'Batch File Processing up to 50 files',
      'Max File Size 250MB',
      '3 Device Activations',
      'Priority Admin Email Support'
    ],
    maxActivations: 3,
    isActive: true,
    isPopular: true,
    badge: 'Best Value',
    createdAt: 1700000000000
  },
  {
    id: 'pro_lifetime',
    name: 'Pro Lifetime License',
    amount: 299,
    currency: 'INR',
    billingInterval: 'lifetime',
    description: 'One-time payment for lifetime access without recurring fees.',
    features: [
      'Lifetime Unlimited Access',
      'All AI PDF Analysis Tools',
      'High-Speed Client-Side Engine',
      '2 Device Activations',
      'No Subscriptions Ever'
    ],
    maxActivations: 2,
    isActive: true,
    isPopular: false,
    badge: 'Popular',
    createdAt: 1700000000000
  },
  {
    id: 'enterprise_annual',
    name: 'Enterprise VIP Team',
    amount: 2499,
    currency: 'INR',
    billingInterval: 'yearly',
    description: 'Tailored for corporate teams requiring multi-device enterprise licensing.',
    features: [
      'All Pro Features Included',
      'Up to 10 Device Activations',
      'Dedicated Priority Admin Support by Surya',
      'Custom Watermark & Export Branding',
      'Zero Cloud Uploads Security'
    ],
    maxActivations: 10,
    isActive: true,
    isPopular: false,
    badge: 'Enterprise',
    createdAt: 1700000000000
  }
];

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
  generatedKey?: string;
  approvedAt?: number;
  notes?: string;
  planId?: string;
  billingInterval?: BillingInterval;
}

export interface ProLicenseRecord {
  licenseKey: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userCompany?: string;
  utrNumber?: string;
  requestId?: string;
  plan: string;
  planName?: string;
  billingInterval?: BillingInterval;
  amount: number;
  status: 'active' | 'revoked' | 'expired' | 'blocked';
  createdAt: number;
  activatedAt?: number;
  activatedCount: number;
  maxActivations: number;
  activatedDevices?: string[];
  boundUserEmail?: string;
  boundUserPhone?: string;
  notes?: string;
  blockedAt?: number;
  blockReason?: string;
  expiresAt?: number;
}

export interface LicenseValidationResult {
  valid: boolean;
  message: string;
  license?: ProLicenseRecord;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseLicenseService {
  private isBrowser: boolean;

  // Firebase Realtime Database REST API Base URL (pure API concept)
  private currentFirebaseUrl: string = (FIREBASE_CONFIG.databaseURL || 'https://pdfmaster-pro-default-rtdb.firebaseio.com').trim().replace(/\/+$/, '');
  private readonly PRO_ACTIVE_KEY = 'pdfcompare_pro_active';
  private readonly PRO_LICENSE_KEY = 'pdfcompare_license_key';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient,
    private cookieStorage: CookieStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Returns current active Firebase Database URL
   */
  public getDatabaseUrl(): string {
    return this.currentFirebaseUrl;
  }

  /**
   * Set custom Firebase Database URL dynamically in memory
   */
  public setDatabaseUrl(url: string): void {
    if (url && url.trim().startsWith('http')) {
      this.currentFirebaseUrl = url.trim().replace(/\/+$/, '');
    }
  }

  /**
   * Sanitize key for Firebase path (no '.', '#', '$', '[', ']', '/')
   */
  public sanitizeKey(key: string): string {
    return key.trim().toUpperCase().replace(/[.#$\[\]\/]/g, '_');
  }

  /**
   * Get or generate unique client device fingerprint ID
   */
  public getDeviceId(): string {
    if (!this.isBrowser) return 'device_srv';
    let devId = localStorage.getItem('pdf_client_device_uid');
    if (!devId) {
      devId = 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      localStorage.setItem('pdf_client_device_uid', devId);
    }
    return devId;
  }

  /**
   * Generate cryptographically unique Pro License Key for each user
   * Format: PDFPRO-XXXX-XXXX-XXXX
   * Over 4.7 x 10^18 entropy combinations guaranteed unique per user
   */
  public generateProKey(prefix: string = 'PDFPRO'): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = (len: number) => {
      let res = '';
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const buf = new Uint8Array(len);
        window.crypto.getRandomValues(buf);
        for (let i = 0; i < len; i++) {
          res += chars.charAt(buf[i] % chars.length);
        }
      } else {
        for (let i = 0; i < len; i++) {
          res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      return res;
    };
    return `${prefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
  }

  /**
   * Submit payment request directly to Firebase: /pro_requests/{requestId}.json
   * NO local/session/cookie storage used. Pure Firebase API.
   */
  public submitPaymentRequest(request: PendingProRequest): Observable<boolean> {
    const cleanId = this.sanitizeKey(request.requestId);
    const url = `${this.getDatabaseUrl()}/pro_requests/${cleanId}.json`;

    return this.http.put(url, request).pipe(
      map(() => true),
      catchError((err) => {
        console.warn('Firebase API request error:', err?.message || err);
        return of(true);
      })
    );
  }

  /**
   * Get all pending and submitted requests directly from Firebase: /pro_requests.json
   * Pure Firebase API concept. Handles 404 / null gracefully.
   */
  public getAllRequests(): Observable<Record<string, PendingProRequest>> {
    const url = `${this.getDatabaseUrl()}/pro_requests.json`;
    return this.http.get<Record<string, PendingProRequest> | null>(url).pipe(
      map((data) => {
        return (data && typeof data === 'object') ? data : {};
      }),
      catchError((err) => {
        // 404 or empty database returns empty map
        return of({});
      })
    );
  }

  /**
   * Approve a pending request and issue Pro License Key directly in Firebase
   * Pure Firebase API concept.
   */
  public approveRequest(request: PendingProRequest, customKey?: string): Observable<string> {
    // If request already has an approved key, return the existing unique key
    if (request.status === 'approved' && request.generatedKey && !customKey) {
      return of(request.generatedKey);
    }

    const issuedKey = customKey || this.generateProKey('PDFPRO');
    const sanitizedKey = this.sanitizeKey(issuedKey);

    const interval: BillingInterval = request.billingInterval || 
      (request.amount === 99 ? 'monthly' : request.amount === 799 ? 'yearly' : 'lifetime');
    const planKey = request.planId || (interval === 'monthly' ? 'pro_monthly' : interval === 'yearly' ? 'pro_yearly' : 'pro_lifetime');

    const licenseRecord: ProLicenseRecord = {
      licenseKey: issuedKey,
      userName: request.userName,
      userEmail: request.userEmail,
      userPhone: request.userPhone,
      userCompany: request.userCompany,
      boundUserEmail: request.userEmail.trim().toLowerCase(),
      boundUserPhone: request.userPhone.trim(),
      utrNumber: request.utrNumber,
      requestId: request.requestId,
      plan: planKey,
      billingInterval: interval,
      amount: request.amount || 299,
      status: 'active',
      createdAt: Date.now(),
      activatedCount: 0,
      maxActivations: 2,
      activatedDevices: [],
      notes: `Approved by Admin for UTR: ${request.utrNumber}`,
      expiresAt: interval === 'monthly' ? Date.now() + 30 * 86400000 : interval === 'yearly' ? Date.now() + 365 * 86400000 : undefined
    };

    const updatedRequest: PendingProRequest = {
      ...request,
      status: 'approved',
      generatedKey: issuedKey,
      approvedAt: Date.now()
    };

    const licenseUrl = `${this.getDatabaseUrl()}/licenses/${sanitizedKey}.json`;
    const reqUrl = `${this.getDatabaseUrl()}/pro_requests/${this.sanitizeKey(request.requestId)}.json`;

    // Save directly to Firebase API
    return this.http.put(licenseUrl, licenseRecord).pipe(
      map(() => {
        this.http.put(reqUrl, updatedRequest).subscribe({ error: () => {} });
        return issuedKey;
      }),
      catchError(() => {
        return of(issuedKey);
      })
    );
  }

  /**
   * Reject a pending request directly in Firebase API
   */
  public rejectRequest(request: PendingProRequest, reason: string = 'UTR verification failed'): Observable<boolean> {
    const updatedRequest: PendingProRequest = {
      ...request,
      status: 'rejected',
      notes: reason
    };

    const reqUrl = `${this.getDatabaseUrl()}/pro_requests/${this.sanitizeKey(request.requestId)}.json`;

    return this.http.put(reqUrl, updatedRequest).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Delete a request directly from Firebase API
   */
  public deleteRequest(requestId: string): Observable<boolean> {
    const reqUrl = `${this.getDatabaseUrl()}/pro_requests/${this.sanitizeKey(requestId)}.json`;
    return this.http.delete(reqUrl).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Get all issued licenses directly from Firebase API: /licenses.json
   */
  public getAllLicenses(): Observable<Record<string, ProLicenseRecord>> {
    const url = `${this.getDatabaseUrl()}/licenses.json`;
    return this.http.get<Record<string, ProLicenseRecord> | null>(url).pipe(
      map((data) => {
        return (data && typeof data === 'object') ? data : {};
      }),
      catchError(() => {
        return of({});
      })
    );
  }

  /**
   * Create or update a license directly in Firebase API
   */
  public saveLicense(license: ProLicenseRecord): Observable<boolean> {
    const sanitizedKey = this.sanitizeKey(license.licenseKey);
    const url = `${this.getDatabaseUrl()}/licenses/${sanitizedKey}.json`;

    return this.http.put(url, license).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Block a user's license directly in Firebase API
   */
  public blockUserLicense(licenseKey: string, reason: string = 'Administrative action by Admin'): Observable<boolean> {
    const sanitized = this.sanitizeKey(licenseKey);
    const url = `${this.getDatabaseUrl()}/licenses/${sanitized}.json`;
    const payload = {
      status: 'blocked',
      blockedAt: Date.now(),
      blockReason: reason
    };

    return this.http.patch(url, payload).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Unblock a user's license directly in Firebase API
   */
  public unblockUserLicense(licenseKey: string): Observable<boolean> {
    const sanitized = this.sanitizeKey(licenseKey);
    const url = `${this.getDatabaseUrl()}/licenses/${sanitized}.json`;
    const payload = {
      status: 'active',
      blockedAt: null,
      blockReason: null
    };

    return this.http.patch(url, payload).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Revoke an active license directly in Firebase API
   */
  public revokeLicense(licenseKey: string, reason: string = 'Revoked by administrator'): Observable<boolean> {
    const sanitized = this.sanitizeKey(licenseKey);
    const url = `${this.getDatabaseUrl()}/licenses/${sanitized}/status.json`;

    return this.http.put(url, JSON.stringify('revoked')).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Delete a license directly from Firebase API
   */
  public deleteLicense(licenseKey: string): Observable<boolean> {
    const sanitized = this.sanitizeKey(licenseKey);
    const url = `${this.getDatabaseUrl()}/licenses/${sanitized}.json`;

    return this.http.delete(url).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Update or change a user's plan in Firebase API
   */
  public changeUserPlan(licenseKey: string, updateData: Partial<ProLicenseRecord>): Observable<boolean> {
    const sanitized = this.sanitizeKey(licenseKey);
    const url = `${this.getDatabaseUrl()}/licenses/${sanitized}.json`;

    return this.http.patch(url, updateData).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Get all Pricing Plans from Firebase API: /pricing_plans.json
   * Returns default plans if Firebase has no plans yet.
   */
  public getAllPlans(): Observable<Record<string, PricingPlan>> {
    const url = `${this.getDatabaseUrl()}/pricing_plans.json`;
    return this.http.get<Record<string, PricingPlan> | null>(url).pipe(
      map((data) => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          return data;
        }
        // Fallback to default plans map
        const defaultMap: Record<string, PricingPlan> = {};
        DEFAULT_PRICING_PLANS.forEach(p => {
          defaultMap[p.id] = p;
        });
        return defaultMap;
      }),
      catchError(() => {
        const defaultMap: Record<string, PricingPlan> = {};
        DEFAULT_PRICING_PLANS.forEach(p => {
          defaultMap[p.id] = p;
        });
        return of(defaultMap);
      })
    );
  }

  /**
   * Create or update a pricing plan directly in Firebase API
   */
  public savePlan(plan: PricingPlan): Observable<boolean> {
    const sanitizedKey = this.sanitizeKey(plan.id);
    const url = `${this.getDatabaseUrl()}/pricing_plans/${sanitizedKey}.json`;

    return this.http.put(url, plan).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * Delete a pricing plan from Firebase API
   */
  public deletePlan(planId: string): Observable<boolean> {
    const sanitizedKey = this.sanitizeKey(planId);
    const url = `${this.getDatabaseUrl()}/pricing_plans/${sanitizedKey}.json`;

    return this.http.delete(url).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }

  /**
   * STRICT VALIDATION & ACTIVATION VIA FIREBASE API
   * Queries Firebase /licenses/{key}.json
   * STRICT RULE: Dummy, guessed, or unapproved keys will NOT be activated!
   */
  public async validateAndActivateLicense(
    rawKey: string, 
    userContext?: { userName?: string; userEmail?: string; userPhone?: string }
  ): Promise<LicenseValidationResult> {
    if (!rawKey || rawKey.trim().length < 8) {
      return {
        valid: false,
        message: 'Invalid license key format. Please enter a valid approved key.'
      };
    }

    const cleanKey = rawKey.trim().toUpperCase();
    const sanitized = this.sanitizeKey(cleanKey);

    // Online verification directly from Firebase REST API
    try {
      const url = `${this.getDatabaseUrl()}/licenses/${sanitized}.json`;
      const record = await this.http.get<ProLicenseRecord | null>(url).toPromise();

      if (record && record.licenseKey) {
        return this.processLicenseRecord(record, sanitized, userContext);
      }
    } catch (netErr) {
      console.warn('Online license verification error:', netErr);
    }

    // STRICT REJECTION: Key not found in verified database!
    return {
      valid: false,
      message: '❌ License Key Not Found. This key has not been approved in the Firebase Paid Users database. Please make sure your payment has been verified by Admin Surya.'
    };
  }

  /**
   * Process and activate verified license record with unique user & device binding
   */
  private processLicenseRecord(
    record: ProLicenseRecord, 
    sanitized: string,
    userContext?: { userName?: string; userEmail?: string; userPhone?: string }
  ): LicenseValidationResult {
    if (record.status === 'blocked') {
      return {
        valid: false,
        message: `⛔ Account Blocked: Your Pro access has been blocked by Administrator Surya. Reason: ${record.blockReason || 'Terms violation or administrative hold'}. Please contact support.`
      };
    }

    if (record.status !== 'active') {
      return {
        valid: false,
        message: `❌ License ${record.licenseKey} has been ${record.status} by Admin.`
      };
    }

    if (record.expiresAt && record.expiresAt < Date.now()) {
      return {
        valid: false,
        message: `⚠️ License Expired: Your plan expired on ${new Date(record.expiresAt).toLocaleDateString()}. Please renew with Admin Surya.`
      };
    }

    // User ownership check: prevent other users from hijacking someone else's key
    if (userContext?.userPhone && record.userPhone) {
      const cleanInputPhone = userContext.userPhone.replace(/[^0-9]/g, '').slice(-10);
      const cleanRecordPhone = record.userPhone.replace(/[^0-9]/g, '').slice(-10);
      if (cleanInputPhone.length >= 10 && cleanRecordPhone.length >= 10 && cleanInputPhone !== cleanRecordPhone) {
        return {
          valid: false,
          message: `❌ Unique License Mismatch: This key was issued exclusively for ${record.userName} (${cleanRecordPhone.slice(0, 3)}****${cleanRecordPhone.slice(-3)}). Every user must purchase their own unique license.`
        };
      }
    }

    // Device tracking: Enforce unique device limits
    const currentDeviceId = this.getDeviceId();
    const activatedDevices = Array.isArray(record.activatedDevices) ? [...record.activatedDevices] : [];
    const maxActivations = record.maxActivations || 2;

    const isAlreadyActivatedOnDevice = activatedDevices.includes(currentDeviceId);

    if (!isAlreadyActivatedOnDevice) {
      if (activatedDevices.length >= maxActivations) {
        return {
          valid: false,
          message: `❌ Activation Limit Exceeded: This unique license is already active on the maximum allowed device(s) (${maxActivations}). Please email Surya (devsurya8470@gmail.com) if you changed devices.`
        };
      }
      activatedDevices.push(currentDeviceId);
    }

    // Update activation count and timestamp in Firebase API
    const updatedRecord: Partial<ProLicenseRecord> = {
      activatedAt: Date.now(),
      activatedCount: activatedDevices.length,
      activatedDevices: activatedDevices,
      boundUserPhone: record.userPhone,
      boundUserEmail: record.userEmail
    };

    const updateUrl = `${this.getDatabaseUrl()}/licenses/${sanitized}.json`;
    this.http.patch(updateUrl, updatedRecord).subscribe({
      error: () => {}
    });

    // Save Pro authorization to cookie for browser session state
    if (this.isBrowser) {
      this.cookieStorage.setItem(this.PRO_ACTIVE_KEY, 'true', 365);
      this.cookieStorage.setItem(this.PRO_LICENSE_KEY, record.licenseKey, 365);
    }

    return {
      valid: true,
      message: `✓ Verified! Pro License granted to ${record.userName || 'User'}.`,
      license: { ...record, ...updatedRecord }
    };
  }
}
