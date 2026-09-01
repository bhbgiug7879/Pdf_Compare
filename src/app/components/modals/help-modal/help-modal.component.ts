import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {
  @Output() close = new EventEmitter<void>();
  searchQuery = '';

  helpArticles = [
    { title: 'How to Merge Multiple PDF Files', cat: 'Organize', text: 'Select "Merge PDF", upload two or more documents, drag cards to set your preferred order, and click "Merge PDFs Now".' },
    { title: 'How to Compress a PDF without Losing Quality', cat: 'Optimize', text: 'Use "Compress PDF", select "Recommended" compression for crisp text with ~40-60% size reduction, or "Extreme" for maximum savings.' },
    { title: 'How to Electronically Sign a PDF', cat: 'Security', text: 'Open "Sign PDF", type your name or draw your signature on the interactive signature canvas, position the signature on your document, and export.' },
    { title: 'How to Permanently Redact Sensitive Text', cat: 'Security', text: 'Open "Redact PDF", highlight confidential regions or SSNs, and click "Apply Permanent Redaction". The underlying text streams are completely sanitized.' },
    { title: 'Is My Document Data Private and Safe?', cat: 'Privacy', text: 'Yes! PDF processing runs 100% locally inside your browser using client-side WebAssembly (WASM). Your files never leave your computer.' }
  ];

  get filteredArticles() {
    if (!this.searchQuery.trim()) return this.helpArticles;
    const q = this.searchQuery.toLowerCase();
    return this.helpArticles.filter(a => a.title.toLowerCase().includes(q) || a.text.toLowerCase().includes(q));
  }
}
