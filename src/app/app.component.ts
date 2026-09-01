import { Component, OnInit } from '@angular/core';
import {
  CompareRequest,
  CompareResponse,
  DiffItem,
  DiffStatus,
  OutputFormat,
  PdfDocument,
  PlanType,
  SamplePreset
} from './models/compare.model';
import { PdfExtractService } from './services/pdf-extract.service';
import { PdfCompareService } from './services/pdf-compare.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PDF Compare AI';

  // Plan and configuration
  currentPlan: PlanType = 'free';
  selectedOutputFormat: OutputFormat = 'table';
  apiKey: string = '';
  showApiKeyModal: boolean = false;
  showProUpgradeModal: boolean = false;
  showTextEditModal: boolean = false;
  editingDocument: PdfDocument | null = null;
  activeResultTab: 'report' | 'side-by-side' | 'raw-prompt' = 'report';

  // Upload state
  documents: PdfDocument[] = [];
  isDragging: boolean = false;
  isComparing: boolean = false;
  comparisonStep: number = 0;
  comparisonStepLabel: string = 'Extracting PDF streams...';

  // Diff results
  compareResponse: CompareResponse | null = null;
  selectedStatusFilter: string = 'all';
  searchQuery: string = '';
  copyFeedback: string | null = null;

  // Presets
  presets: SamplePreset[] = [];

  constructor(
    private pdfExtractService: PdfExtractService,
    private pdfCompareService: PdfCompareService
  ) {}

  ngOnInit(): void {
    this.presets = this.pdfCompareService.SAMPLE_PRESETS;
    // Load default sample preset (Invoice v1 vs Invoice v2)
    this.loadPreset(this.presets[0]);
  }

  // Hover & Visual PDF Inspector State
  hoveredDiffItem: DiffItem | null = null;
  selectedDiffItem: DiffItem | null = null;
  showVisualPdfViewer: boolean = true;
  pdfZoomLevel: number = 100;

  get doc1Name(): string {
    return this.documents.length > 0 ? this.documents[0].fileName : 'File 1';
  }

  get doc2Name(): string {
    return this.documents.length > 1 ? this.documents[1].fileName : 'File 2';
  }

  onHoverDiff(diff: DiffItem | null): void {
    this.hoveredDiffItem = diff;
    if (diff) {
      this.scrollToHighlightInViewer(diff);
    }
  }

  selectDiff(diff: DiffItem): void {
    this.selectedDiffItem = this.selectedDiffItem === diff ? null : diff;
    this.onHoverDiff(diff);
  }

  scrollToHighlightInViewer(diff: DiffItem): void {
    const el1 = document.querySelector(`.doc-panel-1 .hl-active-target`);
    const el2 = document.querySelector(`.doc-panel-2 .hl-active-target`);
    if (el1) {
      el1.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (el2) {
      el2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  isFieldHovered(fieldName: string): boolean {
    if (!this.hoveredDiffItem) return false;
    return this.hoveredDiffItem.fieldName.toLowerCase() === fieldName.toLowerCase();
  }

  isDiffHovered(diff: DiffItem): boolean {
    if (!this.hoveredDiffItem) return false;
    return this.hoveredDiffItem.fieldName === diff.fieldName;
  }

  /**
   * Check if a line contains the hovered diff value or any changed diff item
   */
  getLineDiffInfo(line: string, docIndex: 1 | 2): { isHovered: boolean; isDiff: boolean; status?: DiffStatus; diffItem?: DiffItem } {
    if (!this.compareResponse) return { isHovered: false, isDiff: false };

    const lowerLine = line.toLowerCase();

    // Check if line matches hovered diff
    if (this.hoveredDiffItem) {
      const hVal = docIndex === 1 ? this.hoveredDiffItem.valueInFile1 : this.hoveredDiffItem.valueInFile2;
      const hField = this.hoveredDiffItem.fieldName.toLowerCase();

      if ((hVal && line.includes(hVal)) || lowerLine.includes(hField)) {
        return { isHovered: true, isDiff: true, status: this.hoveredDiffItem.status, diffItem: this.hoveredDiffItem };
      }
    }

    // Check if line matches any diff item
    for (const d of this.compareResponse.differences) {
      const val = docIndex === 1 ? d.valueInFile1 : d.valueInFile2;
      const fName = d.fieldName.toLowerCase();

      if ((val && val.length >= 2 && line.includes(val)) || lowerLine.includes(fName)) {
        return { isHovered: false, isDiff: true, status: d.status, diffItem: d };
      }
    }

    return { isHovered: false, isDiff: false };
  }

  getDocLines(docIndex: 1 | 2): string[] {
    const doc = this.documents[docIndex - 1];
    if (!doc || !doc.content) return [];
    return doc.content.split('\n');
  }

  // Preset Loader
  loadPreset(preset: SamplePreset): void {
    if (preset.id === 'pro_multi' && this.currentPlan === 'free') {
      this.currentPlan = 'pro';
    }

    this.documents = preset.documents.map((d, index) => ({
      id: 'doc_' + (index + 1),
      fileName: d.fileName,
      fileSize: (d.content.length / 1024).toFixed(1) + ' KB',
      pageCount: 1,
      content: d.content,
      isCustomText: true
    }));

    this.compareResponse = null;
  }

  // Plan Management
  setPlan(plan: PlanType): void {
    this.currentPlan = plan;
    if (plan === 'free' && this.documents.length > 2) {
      // Trim to 2 documents on downgrade
      this.documents = this.documents.slice(0, 2);
    }
  }

  openProUpgrade(): void {
    this.showProUpgradeModal = true;
  }

  upgradeToPro(): void {
    this.currentPlan = 'pro';
    this.showProUpgradeModal = false;
  }

  // File Upload Handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFiles(Array.from(target.files));
      target.value = '';
    }
  }

  async handleFiles(files: File[]): Promise<void> {
    const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type.includes('pdf') || f.type.includes('text'));
    
    if (pdfFiles.length === 0 && files.length > 0) {
      alert('Please upload PDF documents or text files.');
      return;
    }

    for (const file of pdfFiles) {
      if (this.currentPlan === 'free' && this.documents.length >= 2) {
        this.openProUpgrade();
        break;
      }

      const extractedDoc = await this.pdfExtractService.extractPdf(file);
      this.documents.push(extractedDoc);
    }

    this.compareResponse = null;
  }

  addNewDocumentSlot(): void {
    if (this.currentPlan === 'free' && this.documents.length >= 2) {
      this.openProUpgrade();
      return;
    }

    const slotNum = this.documents.length + 1;
    this.documents.push({
      id: 'doc_' + Date.now(),
      fileName: `document_draft_${slotNum}.pdf`,
      fileSize: '0 KB',
      pageCount: 1,
      content: `Invoice Number: INV-00${slotNum}\nTotal: $${slotNum * 500}.00\nDate: 2026-08-31`,
      isCustomText: true
    });
    this.compareResponse = null;
  }

  removeDocument(index: number): void {
    this.documents.splice(index, 1);
    this.compareResponse = null;
  }

  openTextEditor(doc: PdfDocument): void {
    this.editingDocument = { ...doc };
    this.showTextEditModal = true;
  }

  saveTextEditor(): void {
    if (this.editingDocument) {
      const idx = this.documents.findIndex(d => d.id === this.editingDocument!.id);
      if (idx !== -1) {
        this.documents[idx] = { ...this.editingDocument };
      }
    }
    this.showTextEditModal = false;
    this.editingDocument = null;
    this.compareResponse = null;
  }

  // Compare Action
  async runComparison(): Promise<void> {
    if (this.documents.length < 2) {
      alert('Please upload or select at least 2 documents to compare.');
      return;
    }

    // Client-side plan guard
    if (this.currentPlan === 'free' && this.documents.length > 2) {
      this.openProUpgrade();
      return;
    }

    this.isComparing = true;
    this.comparisonStep = 1;
    this.comparisonStepLabel = 'Analyzing PDF text streams & structures...';

    const req: CompareRequest = {
      plan: this.currentPlan,
      outputFormat: this.selectedOutputFormat,
      documents: this.documents.map(d => ({
        fileName: d.fileName,
        content: d.content
      }))
    };

    // Step 2
    setTimeout(() => {
      this.comparisonStep = 2;
      this.comparisonStepLabel = 'Normalizing entity labels & key-value pairs...';
    }, 400);

    // Step 3
    setTimeout(() => {
      this.comparisonStep = 3;
      this.comparisonStepLabel = 'Evaluating field differences & semantic clauses...';
    }, 800);

    try {
      const result = await this.pdfCompareService.compareDocuments(req, this.apiKey);

      setTimeout(() => {
        this.compareResponse = result;
        this.isComparing = false;
        this.comparisonStep = 0;
        this.scrollToResults();
      }, 1100);
    } catch (err: any) {
      this.isComparing = false;
      this.comparisonStep = 0;
      alert(`Error comparing documents: ${err?.message || 'Unknown error'}`);
    }
  }

  onFormatChanged(format: OutputFormat): void {
    this.selectedOutputFormat = format;
    if (this.compareResponse) {
      // Re-shape renderedOutput without full re-run
      const doc1Name = this.documents[0]?.fileName || 'File 1';
      const doc2Name = this.documents[1]?.fileName || 'File 2';
      this.compareResponse.renderedOutput = this.pdfCompareService.shapeRenderedOutput(
        format,
        this.compareResponse.summary,
        this.compareResponse.differences,
        doc1Name,
        doc2Name,
        false
      );
    }
  }

  // Filtering
  get filteredDifferences(): DiffItem[] {
    if (!this.compareResponse) return [];
    return this.compareResponse.differences.filter(d => {
      const matchesFilter =
        this.selectedStatusFilter === 'all' ||
        (this.selectedStatusFilter === 'changed' && (d.status === 'value_changed' || d.status === 'label_variation')) ||
        (this.selectedStatusFilter === 'added' && d.status === 'added') ||
        (this.selectedStatusFilter === 'removed' && d.status === 'removed');

      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.fieldName.toLowerCase().includes(q) ||
        (d.valueInFile1 && d.valueInFile1.toLowerCase().includes(q)) ||
        (d.valueInFile2 && d.valueInFile2.toLowerCase().includes(q)) ||
        (d.changeSummary && d.changeSummary.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }

  setStatusFilter(status: string): void {
    this.selectedStatusFilter = status;
  }

  // Clipboard & Exports
  copyToClipboard(text: string, label: string = 'Copied to clipboard!'): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copyFeedback = label;
      setTimeout(() => (this.copyFeedback = null), 2500);
    });
  }

  exportCsv(): void {
    if (!this.compareResponse) return;
    const header = ['Field Name', 'Status', 'File 1 Value', 'File 2 Value', 'File 1 Name', 'File 2 Name', 'Notes'];
    const rows = this.compareResponse.differences.map(d => [
      `"${d.fieldName.replace(/"/g, '""')}"`,
      `"${d.status}"`,
      `"${(d.valueInFile1 || '').replace(/"/g, '""')}"`,
      `"${(d.valueInFile2 || '').replace(/"/g, '""')}"`,
      `"${d.file1}"`,
      `"${d.file2}"`,
      `"${(d.changeSummary || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pdf_compare_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportMarkdown(): void {
    if (!this.compareResponse) return;
    const doc1 = this.documents[0]?.fileName || 'File 1';
    const doc2 = this.documents[1]?.fileName || 'File 2';
    const md = this.pdfCompareService.shapeRenderedOutput('table', this.compareResponse.summary, this.compareResponse.differences, doc1, doc2, false);
    
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `pdf_diff_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportJson(): void {
    if (!this.compareResponse) return;
    const blob = new Blob([JSON.stringify(this.compareResponse, null, 2)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `pdf_diff_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  scrollToResults(): void {
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  }

  scrollToUpload(): void {
    const el = document.getElementById('uploader-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  get systemPromptText(): string {
    return this.pdfCompareService.SYSTEM_PROMPT;
  }

  get userPayloadJson(): string {
    return JSON.stringify({
      plan: this.currentPlan,
      outputFormat: this.selectedOutputFormat,
      documents: this.documents.map(d => ({
        fileName: d.fileName,
        content: d.content
      }))
    }, null, 2);
  }
}
