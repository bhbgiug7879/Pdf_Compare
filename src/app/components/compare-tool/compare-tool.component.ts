import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CompareRequest,
  CompareResponse,
  DiffItem,
  DiffStatus,
  OutputFormat,
  PdfDocument,
  PlanType,
  SamplePreset
} from '../../models/compare.model';
import { PdfExtractService } from '../../services/pdf-extract.service';
import { PdfCompareService } from '../../services/pdf-compare.service';
import { SeoService } from '../../services/seo.service';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { UsageLimitService } from '../../services/usage-limit.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-compare-tool',
  templateUrl: './compare-tool.component.html',
  styleUrls: ['./compare-tool.component.scss']
})
export class CompareToolComponent implements OnInit {
  private isBrowser: boolean;

  // Plan and configuration
  currentPlan: PlanType = 'free';
  selectedOutputFormat: OutputFormat = 'table';
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

  // Hover & Visual PDF Inspector State
  hoveredDiffItem: DiffItem | null = null;
  selectedDiffItem: DiffItem | null = null;

  get doc1Name(): string {
    return this.documents.length > 0 ? this.documents[0].fileName : 'File 1';
  }

  get doc2Name(): string {
    return this.documents.length > 1 ? this.documents[1].fileName : 'File 2';
  }

  constructor(
    private pdfExtractService: PdfExtractService,
    private pdfCompareService: PdfCompareService,
    private seoService: SeoService,
    private toolRegistry: ToolRegistryService,
    public usageLimitService: UsageLimitService,
    public historyService: HistoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const tool = this.toolRegistry.getToolBySlug('compare-pdf');
    if (tool) {
      this.seoService.setToolPageSeo(tool);
    }

    this.presets = this.pdfCompareService.SAMPLE_PRESETS;
    this.documents = [];

    if (this.usageLimitService.isPro()) {
      this.currentPlan = 'pro';
    }
  }

  onHoverDiff(diff: DiffItem | null): void {
    this.hoveredDiffItem = diff;
  }

  selectDiff(diff: DiffItem): void {
    this.selectedDiffItem = this.selectedDiffItem === diff ? null : diff;
    this.onHoverDiff(diff);
  }

  isDiffActive(diff: DiffItem): boolean {
    return this.hoveredDiffItem === diff || this.selectedDiffItem === diff;
  }

  get filteredDiffItems(): DiffItem[] {
    if (!this.compareResponse) return [];
    let items = this.compareResponse.differences;

    if (this.selectedStatusFilter !== 'all') {
      items = items.filter(d => d.status === this.selectedStatusFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(d =>
        d.fieldName.toLowerCase().includes(q) ||
        (d.valueInFile1 && d.valueInFile1.toLowerCase().includes(q)) ||
        (d.valueInFile2 && d.valueInFile2.toLowerCase().includes(q)) ||
        (d.changeSummary && d.changeSummary.toLowerCase().includes(q))
      );
    }

    return items;
  }

  get canCompare(): boolean {
    return this.documents.length >= 2 && !this.isComparing;
  }

  async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    await this.processFiles(Array.from(input.files));
    input.value = '';
  }

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

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      await this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  private async processFiles(files: File[]): Promise<void> {
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    for (const file of pdfFiles) {
      if (this.documents.length >= 2) {
        if (!this.usageLimitService.isPro()) {
          const msg = `Multi-file comparison limit: Free plan compares 2 documents. Upgrade to Pro for ₹${this.usageLimitService.PRO_PRICE_INR} to compare 3+ PDF versions simultaneously!`;
          this.usageLimitService.triggerProModal(msg);
          break;
        }
      }

      // Check file size
      if (!this.usageLimitService.isPro() && file.size > this.usageLimitService.FREE_MAX_FILE_SIZE_MB * 1024 * 1024) {
        const msg = `File "${file.name}" exceeds free 15 MB limit. Upgrade to Pro for ₹${this.usageLimitService.PRO_PRICE_INR} for large document comparison!`;
        this.usageLimitService.triggerProModal(msg);
        return;
      }

      try {
        const extracted = await this.pdfExtractService.extractPdf(file);
        this.documents.push(extracted);
      } catch (err) {
        this.documents.push({
          id: 'doc_' + Math.random().toString(36).substring(2, 9),
          fileName: file.name,
          content: 'Sample extracted text placeholder',
          fileSize: '15 KB',
          pageCount: 1,
          file
        });
      }
    }
  }

  removeDocument(docId: string): void {
    this.documents = this.documents.filter(d => d.id !== docId);
    this.compareResponse = null;
  }

  loadPreset(preset: SamplePreset): void {
    this.documents = preset.documents.map((d, i) => ({
      id: `doc_preset_${i + 1}`,
      fileName: d.fileName,
      fileSize: '15.2 KB',
      pageCount: 1,
      content: d.content
    }));
    this.compareResponse = null;
    this.runComparison();
  }

  async runComparison(): Promise<void> {
    if (!this.canCompare) return;

    // Check usage limits
    const check = this.usageLimitService.checkCanPerformTask(this.documents.length, 0);
    if (!check.allowed) {
      this.usageLimitService.triggerProModal(check.reason);
      return;
    }

    this.isComparing = true;
    this.comparisonStep = 1;
    this.comparisonStepLabel = 'Analyzing document structures...';
    this.compareResponse = null;

    try {
      await new Promise(r => setTimeout(r, 300));
      this.comparisonStep = 2;
      this.comparisonStepLabel = 'Running field-by-field diff extraction...';

      const req: CompareRequest = {
        plan: this.usageLimitService.isPro() ? 'pro' : 'free',
        outputFormat: this.selectedOutputFormat,
        documents: this.documents.map(d => ({
          fileName: d.fileName,
          content: d.content
        }))
      };

      const response = await this.pdfCompareService.compareDocuments(req);
      this.compareResponse = response;
      this.comparisonStep = 3;
      this.comparisonStepLabel = 'Diff generated successfully!';

      this.usageLimitService.incrementDailyUsage();
      this.historyService.addItem({
        toolSlug: 'compare-pdf',
        toolName: 'Compare PDF',
        fileName: `${this.doc1Name} vs ${this.doc2Name}`,
        fileSizeFormatted: 'Diff Report',
        status: 'completed'
      });
    } catch (err) {
      console.error('Comparison failed:', err);
    } finally {
      this.isComparing = false;
    }
  }

  copyJson(): void {
    if (!this.compareResponse) return;
    navigator.clipboard.writeText(JSON.stringify(this.compareResponse.differences, null, 2));
    this.copyFeedback = 'JSON copied!';
    setTimeout(() => this.copyFeedback = null, 2500);
  }

  copySummary(): void {
    if (!this.compareResponse) return;
    const summaryText = JSON.stringify(this.compareResponse.summary, null, 2);
    navigator.clipboard.writeText(summaryText);
    this.copyFeedback = 'Summary copied!';
    setTimeout(() => this.copyFeedback = null, 2500);
  }
}
