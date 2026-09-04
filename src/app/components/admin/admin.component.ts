import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { 
  FirebaseLicenseService, 
  PendingProRequest, 
  ProLicenseRecord, 
  PricingPlan, 
  BillingInterval,
  DEFAULT_PRICING_PLANS 
} from '../../services/firebase-license.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isBrowser: boolean;

  // Authentication: STRICTLY techiesurya / Surya@2000
  isAuthenticated: boolean = false;
  adminUsername: string = '';
  adminPassword: string = '';
  loginError: string | null = null;
  readonly REQUIRED_USER: string = 'techiesurya';
  readonly REQUIRED_PASS: string = 'Surya@2000';

  // Navigation Tabs: includes overview, paid_users, plans, requests, licenses, generate, firebase_json, settings
  activeTab: string = 'overview';
  sidebarOpen: boolean = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
    this.closeSidebar();
  }

  getActiveTabTitle(): string {
    switch (this.activeTab) {
      case 'overview': return 'Executive Overview';
      case 'paid_users': return 'Paid Users Directory';
      case 'plans': return 'Plans & Pricing';
      case 'requests': return 'Payment Requests';
      case 'licenses': return 'Pro Licenses';
      case 'generate': return 'Issue Pro Key';
      case 'firebase_json': return 'Live Database Responses';
      case 'settings': return 'Database Configuration';
      default: return 'Admin Dashboard';
    }
  }

  // Data
  requests: PendingProRequest[] = [];
  licenses: ProLicenseRecord[] = [];
  plans: PricingPlan[] = [];
  rawFirebaseRequests: any = null;
  rawFirebaseLicenses: any = null;
  rawFirebasePlans: any = null;
  loadingRequests: boolean = false;
  loadingLicenses: boolean = false;
  loadingPlans: boolean = false;

  // Filter & Search for Requests
  requestFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
  searchQuery: string = '';

  // Paid Users Screen Filters & State
  paidUsersFilter: 'all' | 'active' | 'blocked' | 'expired' | 'revoked' = 'all';
  paidUsersSearch: string = '';
  paidUsersPlanFilter: string = 'all';

  // Block / Unblock Modal State
  selectedUserForBlock: ProLicenseRecord | null = null;
  blockReasonInput: string = '';
  blockSubmitting: boolean = false;

  // Change Plan Modal State
  selectedUserForPlanChange: ProLicenseRecord | null = null;
  changePlanSelectedId: string = '';
  changePlanAmount: number = 0;
  changePlanInterval: BillingInterval = 'monthly';
  changePlanValidityDays: number = 30;
  changePlanNotes: string = '';
  changePlanSubmitting: boolean = false;

  // User Detail Modal State
  selectedUserForDetails: ProLicenseRecord | null = null;

  // Plans Management State & Form
  planForm: PricingPlan = {
    id: '',
    name: '',
    amount: 99,
    currency: 'INR',
    billingInterval: 'monthly',
    description: '',
    features: [],
    maxActivations: 2,
    isActive: true,
    isPopular: false,
    badge: 'Monthly',
    createdAt: 0
  };
  planFeaturesInput: string = 'Unlimited PDF Comparisons\nSide-by-Side Visual Diff\nBatch File Processing up to 50 files\nMax File Size 250MB\n2 Device Activations';
  isEditingPlan: boolean = false;
  planSubmitting: boolean = false;
  planFormError: string | null = null;

  // UTR Verification & Key Delivery Modal
  selectedRequest: PendingProRequest | null = null;
  verifyingSubmitting: boolean = false;
  issuedKeyResult: string | null = null;

  // Manual License Form
  newLicense = {
    userName: '',
    userEmail: '',
    userPhone: '',
    utrNumber: '',
    plan: 'pro_lifetime' as string,
    billingInterval: 'lifetime' as BillingInterval,
    amount: 299,
    notes: 'Manually issued by Admin Surya'
  };
  generateSubmitting: boolean = false;
  generatedKeySuccess: string | null = null;
  generateError: string | null = null;

  // Database Settings
  databaseUrl: string = '';
  dbTestStatus: 'idle' | 'testing' | 'success' | 'failed' = 'idle';
  dbTestMessage: string = '';

  // Notification Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'info';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private licenseService: FirebaseLicenseService,
    private seoService: SeoService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.seoService.setAdminPageSeo();
      this.databaseUrl = this.licenseService.getDatabaseUrl();
    }
  }

  // --- AUTHENTICATION: techiesurya / nadhansurya0620@gmail.com with Surya@2000 ---
  verifyCredentials(): void {
    this.loginError = null;
    const user = this.adminUsername.trim().toLowerCase();
    const pass = this.adminPassword;

    const isValidUser = (user === 'techiesurya' || user === 'nadhansurya0620@gmail.com');
    const isValidPass = (pass === 'Surya@2000');

    if (isValidUser && isValidPass) {
      this.isAuthenticated = true;
      this.loadAllData();
      this.showToast('Welcome Admin Surya! Access granted.', 'success');
    } else {
      this.loginError = 'Access Denied: Invalid Username or Password. Allowed: techiesurya / Surya@2000.';
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.adminUsername = '';
    this.adminPassword = '';
  }

  // --- DATA LOADING & LIVE FIREBASE RESPONSES ---
  loadAllData(): void {
    this.fetchRequests();
    this.fetchLicenses();
    this.fetchPlans();
  }

  fetchRequests(): void {
    this.loadingRequests = true;
    this.licenseService.getAllRequests().subscribe({
      next: (data) => {
        this.loadingRequests = false;
        this.rawFirebaseRequests = data || {};
        if (data) {
          this.requests = Object.values(data).sort((a, b) => b.submittedAt - a.submittedAt);
        } else {
          this.requests = [];
        }
      },
      error: () => {
        this.loadingRequests = false;
      }
    });
  }

  fetchLicenses(): void {
    this.loadingLicenses = true;
    this.licenseService.getAllLicenses().subscribe({
      next: (data) => {
        this.loadingLicenses = false;
        this.rawFirebaseLicenses = data || {};
        if (data) {
          this.licenses = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
        } else {
          this.licenses = [];
        }
      },
      error: () => {
        this.loadingLicenses = false;
      }
    });
  }

  fetchPlans(): void {
    this.loadingPlans = true;
    this.licenseService.getAllPlans().subscribe({
      next: (data) => {
        this.loadingPlans = false;
        this.rawFirebasePlans = data || {};
        if (data) {
          this.plans = Object.values(data).sort((a, b) => a.amount - b.amount);
        } else {
          this.plans = [...DEFAULT_PRICING_PLANS];
        }
      },
      error: () => {
        this.loadingPlans = false;
        this.plans = [...DEFAULT_PRICING_PLANS];
      }
    });
  }

  // Formatted JSON getters for Admin Screen view
  get rawRequestsJson(): string {
    return JSON.stringify({ pro_requests: this.rawFirebaseRequests || {} }, null, 2);
  }

  get rawLicensesJson(): string {
    return JSON.stringify({ licenses: this.rawFirebaseLicenses || {} }, null, 2);
  }

  get rawPlansJson(): string {
    return JSON.stringify({ pricing_plans: this.rawFirebasePlans || {} }, null, 2);
  }

  // --- COMPUTED STATS ---
  get pendingCount(): number {
    return this.requests.filter(r => r.status === 'pending_admin_approval').length;
  }

  get approvedCount(): number {
    return this.requests.filter(r => r.status === 'approved').length;
  }

  get activeLicensesCount(): number {
    return this.licenses.filter(l => l.status === 'active' && (!l.expiresAt || l.expiresAt >= Date.now())).length;
  }

  get blockedCount(): number {
    return this.licenses.filter(l => l.status === 'blocked').length;
  }

  get monthlyUsersCount(): number {
    return this.licenses.filter(l => l.billingInterval === 'monthly' || (l.plan && l.plan.includes('monthly'))).length;
  }

  get yearlyUsersCount(): number {
    return this.licenses.filter(l => l.billingInterval === 'yearly' || (l.plan && (l.plan.includes('yearly') || l.plan.includes('annual')))).length;
  }

  get lifetimeUsersCount(): number {
    return this.licenses.filter(l => !l.billingInterval || l.billingInterval === 'lifetime' || (l.plan && l.plan.includes('lifetime'))).length;
  }

  get totalRevenueInr(): number {
    return this.requests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + (r.amount || 299), 0);
  }

  get paidUsersRevenueInr(): number {
    return this.licenses
      .filter(l => l.status !== 'revoked')
      .reduce((sum, l) => sum + (l.amount || 299), 0);
  }

  // Filtered Paid Users for the Paid Users Screen
  get paidUsersList(): ProLicenseRecord[] {
    let list = this.licenses;

    // Status filter
    if (this.paidUsersFilter !== 'all') {
      if (this.paidUsersFilter === 'active') {
        list = list.filter(u => u.status === 'active' && (!u.expiresAt || u.expiresAt >= Date.now()));
      } else if (this.paidUsersFilter === 'blocked') {
        list = list.filter(u => u.status === 'blocked');
      } else if (this.paidUsersFilter === 'expired') {
        list = list.filter(u => u.status === 'expired' || (u.expiresAt && u.expiresAt < Date.now()));
      } else if (this.paidUsersFilter === 'revoked') {
        list = list.filter(u => u.status === 'revoked');
      }
    }

    // Plan / interval filter
    if (this.paidUsersPlanFilter !== 'all') {
      list = list.filter(u => (u.plan === this.paidUsersPlanFilter) || (u.billingInterval === this.paidUsersPlanFilter));
    }

    // Search query
    if (this.paidUsersSearch.trim()) {
      const q = this.paidUsersSearch.toLowerCase().trim();
      list = list.filter(u =>
        (u.userName && u.userName.toLowerCase().includes(q)) ||
        (u.userEmail && u.userEmail.toLowerCase().includes(q)) ||
        (u.userPhone && u.userPhone.includes(q)) ||
        (u.licenseKey && u.licenseKey.toLowerCase().includes(q)) ||
        (u.utrNumber && u.utrNumber.toLowerCase().includes(q)) ||
        (u.plan && u.plan.toLowerCase().includes(q)) ||
        (u.userCompany && u.userCompany.toLowerCase().includes(q))
      );
    }

    return list;
  }

  get filteredRequests(): PendingProRequest[] {
    let list = this.requests;
    if (this.requestFilter !== 'all') {
      if (this.requestFilter === 'pending') {
        list = list.filter(r => r.status === 'pending_admin_approval');
      } else {
        list = list.filter(r => r.status === this.requestFilter);
      }
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(r =>
        r.userName.toLowerCase().includes(q) ||
        r.userPhone.includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.utrNumber.toLowerCase().includes(q) ||
        r.requestId.toLowerCase().includes(q)
      );
    }
    return list;
  }

  get filteredLicenses(): ProLicenseRecord[] {
    let list = this.licenses;
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(l =>
        l.licenseKey.toLowerCase().includes(q) ||
        (l.userName && l.userName.toLowerCase().includes(q)) ||
        (l.userPhone && l.userPhone.includes(q)) ||
        (l.userEmail && l.userEmail.toLowerCase().includes(q)) ||
        (l.utrNumber && l.utrNumber.toLowerCase().includes(q))
      );
    }
    return list;
  }

  // --- UTR VERIFICATION & MODAL WORKFLOW ---
  openVerifyModal(req: PendingProRequest): void {
    this.selectedRequest = req;
    this.issuedKeyResult = req.generatedKey || null;
    this.verifyingSubmitting = false;
  }

  closeVerifyModal(): void {
    this.selectedRequest = null;
    this.issuedKeyResult = null;
    this.verifyingSubmitting = false;
  }

  confirmUtrAndIssueKey(): void {
    if (!this.selectedRequest) return;

    this.verifyingSubmitting = true;
    const req = this.selectedRequest;

    this.licenseService.approveRequest(req).subscribe({
      next: (generatedKey) => {
        this.verifyingSubmitting = false;
        this.issuedKeyResult = generatedKey;
        this.showToast(`✓ UTR Verified! License ${generatedKey} generated and saved in Firebase.`, 'success');
        this.loadAllData();
      },
      error: () => {
        this.verifyingSubmitting = false;
        this.showToast('Failed to save approved license to Firebase.', 'error');
      }
    });
  }

  rejectPayment(req: PendingProRequest): void {
    const reason = prompt('Enter rejection reason (e.g. UTR not credited in SBI account):', 'Payment UTR verification failed');
    if (reason === null) return;

    this.licenseService.rejectRequest(req, reason).subscribe({
      next: () => {
        this.showToast(`Request from ${req.userName} marked as rejected.`, 'info');
        this.loadAllData();
        if (this.selectedRequest?.requestId === req.requestId) {
          this.closeVerifyModal();
        }
      }
    });
  }

  deleteRequestRecord(req: PendingProRequest): void {
    if (!confirm(`Permanently remove request ${req.requestId}?`)) return;

    this.licenseService.deleteRequest(req.requestId).subscribe({
      next: () => {
        this.showToast('Request record removed.', 'info');
        this.loadAllData();
      }
    });
  }

  // --- LICENSE ACTIONS ---
  revokeLicense(lic: ProLicenseRecord): void {
    if (!confirm(`Are you sure you want to REVOKE license ${lic.licenseKey} for ${lic.userName}? The user will immediately lose Pro access.`)) {
      return;
    }

    this.licenseService.revokeLicense(lic.licenseKey).subscribe({
      next: () => {
        this.showToast(`License ${lic.licenseKey} has been REVOKED.`, 'info');
        this.fetchLicenses();
      }
    });
  }

  reActivateLicense(lic: ProLicenseRecord): void {
    const updated: ProLicenseRecord = {
      ...lic,
      status: 'active'
    };
    this.licenseService.saveLicense(updated).subscribe({
      next: () => {
        this.showToast(`License ${lic.licenseKey} re-activated.`, 'success');
        this.fetchLicenses();
      }
    });
  }

  deleteLicenseRecord(lic: ProLicenseRecord): void {
    if (!confirm(`Permanently delete license ${lic.licenseKey}?`)) return;

    this.licenseService.deleteLicense(lic.licenseKey).subscribe({
      next: () => {
        this.showToast('License record deleted.', 'info');
        this.fetchLicenses();
      }
    });
  }

  // --- PAID USERS SCREEN ACTIONS: BLOCK / UNBLOCK ---
  openBlockModal(user: ProLicenseRecord): void {
    this.selectedUserForBlock = user;
    this.blockReasonInput = user.blockReason || 'Terms violation or administrative hold';
    this.blockSubmitting = false;
  }

  closeBlockModal(): void {
    this.selectedUserForBlock = null;
    this.blockReasonInput = '';
    this.blockSubmitting = false;
  }

  confirmBlockUser(): void {
    if (!this.selectedUserForBlock) return;
    this.blockSubmitting = true;
    const key = this.selectedUserForBlock.licenseKey;
    const reason = this.blockReasonInput.trim() || 'Blocked by Admin Surya';

    this.licenseService.blockUserLicense(key, reason).subscribe({
      next: () => {
        this.blockSubmitting = false;
        this.showToast(`⛔ User ${this.selectedUserForBlock?.userName || key} has been BLOCKED.`, 'error');
        this.closeBlockModal();
        this.fetchLicenses();
      },
      error: () => {
        this.blockSubmitting = false;
        this.showToast('Failed to block user license.', 'error');
      }
    });
  }

  unblockUser(user: ProLicenseRecord): void {
    if (!confirm(`Restore and UNBLOCK user ${user.userName} (${user.licenseKey})? Pro access will be re-enabled immediately.`)) return;

    this.licenseService.unblockUserLicense(user.licenseKey).subscribe({
      next: () => {
        this.showToast(`🟢 User ${user.userName} unblocked! Pro access is restored.`, 'success');
        this.fetchLicenses();
      },
      error: () => {
        this.showToast('Failed to unblock user license.', 'error');
      }
    });
  }

  // --- PAID USERS SCREEN ACTIONS: CHANGE PLAN ---
  openChangePlanModal(user: ProLicenseRecord): void {
    this.selectedUserForPlanChange = user;
    this.changePlanSelectedId = user.plan || (this.plans[0]?.id || 'pro_monthly');
    const matchedPlan = this.plans.find(p => p.id === this.changePlanSelectedId);
    this.changePlanAmount = matchedPlan ? matchedPlan.amount : (user.amount || 299);
    this.changePlanInterval = user.billingInterval || (matchedPlan ? matchedPlan.billingInterval : 'monthly');
    this.changePlanValidityDays = this.changePlanInterval === 'monthly' ? 30 : this.changePlanInterval === 'yearly' ? 365 : 0;
    this.changePlanNotes = `Plan updated by Admin Surya on ${new Date().toLocaleDateString()}`;
    this.changePlanSubmitting = false;
  }

  closeChangePlanModal(): void {
    this.selectedUserForPlanChange = null;
    this.changePlanSubmitting = false;
  }

  onPlanSelectedInModal(): void {
    const matchedPlan = this.plans.find(p => p.id === this.changePlanSelectedId);
    if (matchedPlan) {
      this.changePlanAmount = matchedPlan.amount;
      this.changePlanInterval = matchedPlan.billingInterval;
      this.changePlanValidityDays = matchedPlan.billingInterval === 'monthly' ? 30 : matchedPlan.billingInterval === 'yearly' ? 365 : 0;
    }
  }

  confirmChangePlan(): void {
    if (!this.selectedUserForPlanChange) return;
    this.changePlanSubmitting = true;
    const user = this.selectedUserForPlanChange;
    const matchedPlan = this.plans.find(p => p.id === this.changePlanSelectedId);

    const expiresAt = this.changePlanInterval === 'lifetime' 
      ? undefined 
      : Date.now() + (this.changePlanValidityDays * 86400000);

    const updateData: Partial<ProLicenseRecord> = {
      plan: this.changePlanSelectedId,
      planName: matchedPlan?.name || this.changePlanSelectedId,
      amount: this.changePlanAmount,
      billingInterval: this.changePlanInterval,
      expiresAt: expiresAt,
      maxActivations: matchedPlan?.maxActivations || user.maxActivations || 2,
      notes: this.changePlanNotes.trim() || user.notes
    };

    this.licenseService.changeUserPlan(user.licenseKey, updateData).subscribe({
      next: () => {
        this.changePlanSubmitting = false;
        this.showToast(`✓ Plan changed to "${matchedPlan?.name || this.changePlanSelectedId}" for ${user.userName}.`, 'success');
        this.closeChangePlanModal();
        this.fetchLicenses();
      },
      error: () => {
        this.changePlanSubmitting = false;
        this.showToast('Failed to update user plan in Firebase.', 'error');
      }
    });
  }

  // --- USER DETAILS MODAL ---
  openUserDetailModal(user: ProLicenseRecord): void {
    this.selectedUserForDetails = user;
  }

  closeUserDetailModal(): void {
    this.selectedUserForDetails = null;
  }

  // --- PLANS MANAGEMENT: CREATE / EDIT / DELETE PLANS ---
  resetPlanForm(): void {
    this.planForm = {
      id: '',
      name: '',
      amount: 99,
      currency: 'INR',
      billingInterval: 'monthly',
      description: '',
      features: [],
      maxActivations: 2,
      isActive: true,
      isPopular: false,
      badge: 'Monthly',
      createdAt: 0
    };
    this.planFeaturesInput = 'Unlimited PDF Comparisons\nSide-by-Side Visual Diff\nBatch File Processing up to 50 files\nMax File Size 250MB\n2 Device Activations';
    this.isEditingPlan = false;
    this.planFormError = null;
    this.planSubmitting = false;
  }

  editPlan(plan: PricingPlan): void {
    this.isEditingPlan = true;
    this.planForm = { ...plan };
    this.planFeaturesInput = (plan.features || []).join('\n');
    this.planFormError = null;
  }

  cancelEditPlan(): void {
    this.resetPlanForm();
  }

  savePlanSubmit(): void {
    this.planFormError = null;
    const name = this.planForm.name.trim();
    if (!name) {
      this.planFormError = 'Please enter a plan name.';
      return;
    }

    if (!this.planForm.amount || this.planForm.amount <= 0) {
      this.planFormError = 'Please enter a valid price amount (₹).';
      return;
    }

    let planId = this.planForm.id.trim();
    if (!planId) {
      // Auto-generate id from name and interval
      planId = 'plan_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + this.planForm.billingInterval;
    }

    const featuresArray = this.planFeaturesInput
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const planToSave: PricingPlan = {
      ...this.planForm,
      id: planId,
      name: name,
      features: featuresArray,
      createdAt: this.planForm.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    this.planSubmitting = true;
    this.licenseService.savePlan(planToSave).subscribe({
      next: () => {
        this.planSubmitting = false;
        this.showToast(`✓ Plan "${planToSave.name}" (₹${planToSave.amount}/${planToSave.billingInterval}) saved!`, 'success');
        this.resetPlanForm();
        this.fetchPlans();
      },
      error: () => {
        this.planSubmitting = false;
        this.planFormError = 'Failed to save plan to Firebase database.';
      }
    });
  }

  deletePlanSubmit(plan: PricingPlan): void {
    if (!confirm(`Are you sure you want to delete plan "${plan.name}" (₹${plan.amount})?`)) return;

    this.licenseService.deletePlan(plan.id).subscribe({
      next: () => {
        this.showToast(`Plan "${plan.name}" removed from database.`, 'info');
        this.fetchPlans();
      },
      error: () => {
        this.showToast('Failed to delete plan from Firebase.', 'error');
      }
    });
  }

  togglePlanStatus(plan: PricingPlan): void {
    const updated: PricingPlan = {
      ...plan,
      isActive: !plan.isActive,
      updatedAt: Date.now()
    };

    this.licenseService.savePlan(updated).subscribe({
      next: () => {
        this.showToast(`Plan "${plan.name}" is now ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}.`, 'info');
        this.fetchPlans();
      }
    });
  }

  // --- HELPERS & FORMATTERS ---
  getPlanName(planKey?: string): string {
    if (!planKey) return 'Pro Plan';
    const p = this.plans.find(x => x.id === planKey);
    if (p) return p.name;
    if (planKey === 'pro_lifetime') return 'Pro Lifetime';
    if (planKey === 'pro_monthly') return 'Pro Monthly';
    if (planKey === 'pro_yearly') return 'Pro Annual Pass';
    if (planKey === 'enterprise' || planKey === 'enterprise_annual') return 'Enterprise VIP';
    return planKey;
  }

  formatInterval(interval?: string): string {
    if (!interval || interval === 'lifetime') return 'Lifetime';
    if (interval === 'monthly') return 'Monthly';
    if (interval === 'yearly') return 'Yearly';
    if (interval === 'quarterly') return 'Quarterly';
    return interval;
  }

  getExpiryBadge(user: ProLicenseRecord): { text: string; isExpired: boolean; isWarning: boolean } {
    if (user.status === 'blocked') {
      return { text: 'Blocked', isExpired: true, isWarning: true };
    }
    if (!user.expiresAt || user.billingInterval === 'lifetime' || user.plan === 'pro_lifetime') {
      return { text: 'Lifetime (Never Expires)', isExpired: false, isWarning: false };
    }

    const now = Date.now();
    const diffDays = Math.ceil((user.expiresAt - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Expired ${Math.abs(diffDays)}d ago`, isExpired: true, isWarning: true };
    }
    if (diffDays <= 7) {
      return { text: `Expires in ${diffDays}d`, isExpired: false, isWarning: true };
    }
    return { text: `${diffDays} days left`, isExpired: false, isWarning: false };
  }

  getSubscriberCountForPlan(planId: string, interval?: string): number {
    return this.licenses.filter(l => l.plan === planId || (interval && l.billingInterval === interval)).length;
  }

  // --- MANUAL LICENSE GENERATION ---
  generateManualLicense(): void {
    this.generateError = null;
    this.generatedKeySuccess = null;

    const name = this.newLicense.userName.trim();
    const phone = this.newLicense.userPhone.trim();
    const email = this.newLicense.userEmail.trim();

    if (!name) {
      this.generateError = 'Please enter user name.';
      return;
    }

    if (!phone && !email) {
      this.generateError = 'Please provide either a phone number or email address.';
      return;
    }

    this.generateSubmitting = true;
    const newKey = this.licenseService.generateProKey('PDFPRO');

    const record: ProLicenseRecord = {
      licenseKey: newKey,
      userName: name,
      userEmail: email || 'manual@customer.com',
      userPhone: phone || 'N/A',
      utrNumber: this.newLicense.utrNumber.trim() || 'MANUAL-ADMIN-ENTRY',
      plan: this.newLicense.plan,
      amount: this.newLicense.amount,
      status: 'active',
      createdAt: Date.now(),
      activatedCount: 0,
      maxActivations: 3,
      notes: this.newLicense.notes
    };

    this.licenseService.saveLicense(record).subscribe({
      next: () => {
        this.generateSubmitting = false;
        this.generatedKeySuccess = newKey;
        this.showToast(`License ${newKey} issued successfully!`, 'success');
        this.fetchLicenses();
      },
      error: () => {
        this.generateSubmitting = false;
        this.generateError = 'Failed to save license to database.';
      }
    });
  }

  // --- DATABASE SETTINGS ---
  saveDatabaseSettings(): void {
    this.licenseService.setDatabaseUrl(this.databaseUrl);
    this.showToast('Firebase Realtime Database URL updated.', 'success');
    this.loadAllData();
  }

  testDatabaseConnection(): void {
    this.dbTestStatus = 'testing';
    this.dbTestMessage = 'Testing Firebase connection...';

    this.licenseService.getAllRequests().subscribe({
      next: () => {
        this.dbTestStatus = 'success';
        this.dbTestMessage = '✓ Connected successfully to Firebase Database!';
      },
      error: (err) => {
        this.dbTestStatus = 'failed';
        this.dbTestMessage = `Connection failed: ${err.message || 'Check database URL or read/write rules'}`;
      }
    });
  }

  // --- UTILITIES & DISPATCH ---
  copyToClipboard(text: string): void {
    if (this.isBrowser && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(`Copied: ${text}`, 'info');
      });
    }
  }

  getWhatsAppSendUrl(phone: string, name: string, key: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `*PDF MASTER PRO — PAYMENT APPROVED!*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello ${name},\n` +
      `Your ₹299 UPI payment (UTR verified in SBI account) has been approved by Admin Surya.\n\n` +
      `🔑 *Your Official Pro License Key*:\n` +
      `*${key}*\n\n` +
      `*How to Activate*:\n` +
      `1. Open PDF Master.\n` +
      `2. Click "Upgrade to Pro" or "Already have license key".\n` +
      `3. Paste your key: *${key}* and click *Activate Pro*.\n\n` +
      `Enjoy lifetime unlimited batch files & AI PDF tools!`;

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  }

  getEmailSendUrl(email: string, name: string, key: string): string {
    const subject = encodeURIComponent('Your PDF Master Pro License Key (Payment Approved)');
    const body = encodeURIComponent(
      `Hello ${name},\n\n` +
      `Your ₹299 UPI payment has been verified by Admin Surya.\n\n` +
      `Your Official Pro License Key:\n` +
      `${key}\n\n` +
      `To activate:\n` +
      `1. Open PDF Master\n` +
      `2. Click Upgrade to Pro -> Enter License Key\n` +
      `3. Paste ${key} and click Activate Pro.\n\n` +
      `Regards,\nSurya (PDF Master Admin)`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  showToast(msg: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
