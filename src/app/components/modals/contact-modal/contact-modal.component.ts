import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent {
  @Output() close = new EventEmitter<void>();

  fullName = '';
  emailOrPhone = '';
  issueCategory = 'Payment & Pro Key Issue';
  utrReference = '';
  description = '';

  isSubmitted = false;
  isSubmitting = false;
  ticketId = '';

  supportEmail = 'devsurya8470@gmail.com';

  get emailComplaintUrl(): string {
    const subject = encodeURIComponent(`PDF Master Support Request: ${this.issueCategory}`);
    const text = `PDF Master Support Request / Complaint\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Issue: ${this.issueCategory}\n` +
      `• Name: ${this.fullName || 'User'}\n` +
      `• Contact: ${this.emailOrPhone || 'N/A'}\n` +
      (this.utrReference ? `• UTR / Payment Ref: ${this.utrReference}\n` : '') +
      `• Description: ${this.description || 'Assistance needed'}`;
    return `mailto:${this.supportEmail}?subject=${subject}&body=${encodeURIComponent(text)}`;
  }

  get whatsAppComplaintUrl(): string {
    return this.emailComplaintUrl;
  }

  submitComplaint(): void {
    if (!this.description.trim() && !this.fullName.trim()) return;

    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
      this.ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    }, 800);
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.fullName = '';
    this.emailOrPhone = '';
    this.utrReference = '';
    this.description = '';
    this.close.emit();
  }
}
