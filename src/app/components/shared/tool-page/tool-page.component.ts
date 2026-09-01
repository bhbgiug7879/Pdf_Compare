import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolRegistryService } from '../../../services/tool-registry.service';
import { SeoService } from '../../../services/seo.service';
import { PdfEngineService } from '../../../services/pdf-engine.service';
import { UsageLimitService } from '../../../services/usage-limit.service';
import { HistoryService } from '../../../services/history.service';
import { ToolDefinition, UploadedFileItem, ProcessedResult, PageThumbnailItem } from '../../../models/tool.model';

@Component({
  selector: 'app-tool-page',
  templateUrl: './tool-page.component.html',
  styleUrls: ['./tool-page.component.scss']
})
export class ToolPageComponent implements OnInit {
  tool: ToolDefinition | undefined;
  relatedTools: ToolDefinition[] = [];

  // Uploaded files & state
  uploadedFiles: UploadedFileItem[] = [];
  isDragging = false;
  isProcessing = false;
  progressPercent = 0;
  progressStatus = 'Preparing document...';
  processedResult: ProcessedResult | null = null;
  errorMessage: string | null = null;

  // Visual Page Grid Items for Organize, Split, Remove, Extract, Rotate
  pageThumbnails: PageThumbnailItem[] = [];

  // Tool Specific Options
  // 1. Split
  splitRange = '1-3';
  splitMode: 'range' | 'every-page' = 'range';

  // 2. Compress
  compressPreset: 'extreme' | 'recommended' | 'light' = 'recommended';

  // 3. Rotate
  rotateAngle = 90;
  rotateTarget: 'all' | 'odd' | 'even' = 'all';

  // 4. Page Numbers
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left' = 'bottom-center';
  pageNumberFormat: 'Page 1 of N' | '1' | 'Doc - 1' = 'Page 1 of N';
  pageNumberStart = 1;

  // 5. Watermark
  watermarkText = 'CONFIDENTIAL';
  watermarkOpacity = 0.3;
  watermarkAngle = 45;
  watermarkFontSize = 48;

  // 6. Protect & Unlock
  pdfPassword = '';
  confirmPassword = '';

  // 7. Signature (Draw / Type)
  signatureMode: 'draw' | 'type' = 'draw';
  typedSignatureName = 'John Doe';
  signatureDataUrl = '';
  signaturePlaced = false;

  // 8. Images to PDF
  imgOrientation: 'portrait' | 'landscape' | 'auto' = 'portrait';
  imgPageSize: 'A4' | 'Letter' | 'Fit' = 'A4';

  // 9. AI Summarizer
  summaryDetailLevel: 'tldr' | 'standard' | 'comprehensive' = 'standard';

  // 10. Translation
  targetLanguage = 'Spanish';

  // FAQ Accordion Toggle Map
  faqOpenMap: { [index: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public toolRegistry: ToolRegistryService,
    private seoService: SeoService,
    private pdfEngine: PdfEngineService,
    public usageLimitService: UsageLimitService,
    public historyService: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = this.route.snapshot.data['toolSlug'] || params.get('slug') || this.route.snapshot.url[0]?.path;
      this.loadTool(slug);
    });
  }

  loadTool(slug: string): void {
    this.tool = this.toolRegistry.getToolBySlug(slug);
    if (!this.tool) {
      this.router.navigate(['/']);
      return;
    }

    this.seoService.setToolPageSeo(this.tool);
    this.relatedTools = this.toolRegistry.getRelatedTools(this.tool);
    this.resetWorkspace();

    // Default open first FAQ
    this.faqOpenMap = { 0: true };
  }

  resetWorkspace(): void {
    this.uploadedFiles = [];
    this.pageThumbnails = [];
    this.processedResult = null;
    this.errorMessage = null;
    this.isProcessing = false;
    this.progressPercent = 0;
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
      this.handleSelectedFiles(event.dataTransfer.files);
    }
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleSelectedFiles(input.files);
    }
    input.value = ''; // Reset input
  }

  async handleSelectedFiles(fileList: FileList): Promise<void> {
    this.errorMessage = null;
    const files = Array.from(fileList);

    if (files.length === 0) return;

    // Check Batch Limit for Free Plan
    const totalFilesAfterUpload = this.uploadedFiles.length + files.length;
    if (!this.usageLimitService.isPro() && this.tool?.acceptsMultipleFiles && totalFilesAfterUpload > this.usageLimitService.FREE_MAX_BATCH_FILES) {
      const msg = `Batch limit reached: Free plan allows merging/converting up to ${this.usageLimitService.FREE_MAX_BATCH_FILES} files. Upgrade to Pro for ₹${this.usageLimitService.PRO_PRICE_INR} for unlimited batch files!`;
      this.usageLimitService.triggerProModal(msg);
      return;
    }

    if (!this.tool?.acceptsMultipleFiles && (files.length > 1 || this.uploadedFiles.length >= 1)) {
      this.uploadedFiles = []; // Replace single file
    }

    for (const file of files) {
      // Check File Size Limit for Free vs Pro
      const maxAllowedBytes = this.usageLimitService.isPro() 
        ? this.usageLimitService.PRO_MAX_FILE_SIZE_MB * 1024 * 1024 
        : this.usageLimitService.FREE_MAX_FILE_SIZE_MB * 1024 * 1024;

      if (file.size > maxAllowedBytes) {
        const fileMb = (file.size / (1024 * 1024)).toFixed(1);
        if (!this.usageLimitService.isPro()) {
          const msg = `File size limit reached: "${file.name}" is ${fileMb} MB (Free limit: ${this.usageLimitService.FREE_MAX_FILE_SIZE_MB} MB). Upgrade to Pro for ₹${this.usageLimitService.PRO_PRICE_INR} to process large files up to 250 MB!`;
          this.usageLimitService.triggerProModal(msg);
        } else {
          this.errorMessage = `File ${file.name} (${fileMb} MB) exceeds the 250 MB maximum Pro limit.`;
        }
        continue;
      }

      const item: UploadedFileItem = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        selected: true
      };

      try {
        const buffer = await file.arrayBuffer();
        item.dataArrayBuffer = buffer;

        if (file.type.includes('pdf')) {
          this.generateThumbnailsPreview(item);
        }
      } catch (err) {
        console.warn('Could not read array buffer for', file.name);
      }

      this.uploadedFiles.push(item);
    }

    this.cdr.detectChanges();
  }

  generateThumbnailsPreview(item: UploadedFileItem): void {
    this.pageThumbnails = [];
    const estimatedPages = Math.max(1, Math.min(8, Math.ceil(item.size / (150 * 1024))));
    item.pageCount = estimatedPages;

    for (let i = 1; i <= estimatedPages; i++) {
      this.pageThumbnails.push({
        pageNumber: i,
        originalIndex: i - 1,
        rotation: 0,
        selected: true
      });
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    if (this.uploadedFiles.length === 0) {
      this.pageThumbnails = [];
    }
  }

  moveFileUp(index: number): void {
    if (index > 0) {
      const temp = this.uploadedFiles[index];
      this.uploadedFiles[index] = this.uploadedFiles[index - 1];
      this.uploadedFiles[index - 1] = temp;
    }
  }

  moveFileDown(index: number): void {
    if (index < this.uploadedFiles.length - 1) {
      const temp = this.uploadedFiles[index];
      this.uploadedFiles[index] = this.uploadedFiles[index + 1];
      this.uploadedFiles[index + 1] = temp;
    }
  }

  togglePageSelection(thumb: PageThumbnailItem): void {
    thumb.selected = !thumb.selected;
  }

  rotateThumbnail(thumb: PageThumbnailItem, deg: number = 90): void {
    thumb.rotation = (thumb.rotation + deg) % 360;
  }

  toggleFaq(idx: number): void {
    this.faqOpenMap[idx] = !this.faqOpenMap[idx];
  }

  // Primary Tool Action Execution
  async executeToolAction(): Promise<void> {
    if (!this.tool || this.uploadedFiles.length === 0) return;

    // Check Usage & Daily Limits
    const check = this.usageLimitService.checkCanPerformTask(
      this.uploadedFiles.length,
      Math.max(...this.uploadedFiles.map(f => f.size))
    );

    if (!check.allowed) {
      this.usageLimitService.triggerProModal(check.reason);
      return;
    }

    this.isProcessing = true;
    this.progressPercent = 15;
    this.progressStatus = 'Initializing WASM Engine...';
    this.errorMessage = null;

    try {
      await new Promise(r => setTimeout(r, 200));
      this.progressPercent = 45;
      this.progressStatus = `Processing with ${this.tool.name}...`;

      let result: ProcessedResult;

      switch (this.tool.id) {
        case 'merge-pdf':
          result = await this.pdfEngine.mergePdfs(this.uploadedFiles);
          break;

        case 'split-pdf':
          result = await this.pdfEngine.splitPdf(this.uploadedFiles[0], this.splitRange, this.splitMode);
          break;

        case 'remove-pages': {
          const removedPages = this.pageThumbnails.filter(p => !p.selected).map(p => p.pageNumber);
          result = await this.pdfEngine.removePages(this.uploadedFiles[0], removedPages.length > 0 ? removedPages : [1]);
          break;
        }

        case 'extract-pages': {
          const selectedPages = this.pageThumbnails.filter(p => p.selected).map(p => p.pageNumber);
          result = await this.pdfEngine.extractPages(this.uploadedFiles[0], selectedPages.length > 0 ? selectedPages : [1]);
          break;
        }

        case 'organize-pdf': {
          const order = this.pageThumbnails.map(p => p.originalIndex);
          const rotations: { [idx: number]: number } = {};
          this.pageThumbnails.forEach(p => rotations[p.originalIndex] = p.rotation);
          result = await this.pdfEngine.organizePdf(this.uploadedFiles[0], order, rotations);
          break;
        }

        case 'rotate-pdf':
          result = await this.pdfEngine.rotatePdf(this.uploadedFiles[0], this.rotateAngle, this.rotateTarget);
          break;

        case 'compress-pdf':
          result = await this.pdfEngine.compressPdf(this.uploadedFiles[0], this.compressPreset);
          break;

        case 'add-watermark':
          result = await this.pdfEngine.addWatermark(this.uploadedFiles[0], this.watermarkText, {
            opacity: this.watermarkOpacity,
            angle: this.watermarkAngle,
            fontSize: this.watermarkFontSize,
            color: '#ef4444'
          });
          break;

        case 'add-page-numbers':
          result = await this.pdfEngine.addPageNumbers(this.uploadedFiles[0], this.pageNumberPosition, this.pageNumberFormat, this.pageNumberStart);
          break;

        case 'protect-pdf':
          if (!this.pdfPassword) throw new Error('Please enter a secure password.');
          result = await this.pdfEngine.protectPdf(this.uploadedFiles[0], this.pdfPassword);
          break;

        case 'unlock-pdf':
          result = await this.pdfEngine.unlockPdf(this.uploadedFiles[0], this.pdfPassword);
          break;

        case 'sign-pdf': {
          const sampleSig = this.generateSampleSignatureImage(this.typedSignatureName);
          result = await this.pdfEngine.signPdf(this.uploadedFiles[0], sampleSig, 1, 100, 100);
          break;
        }

        case 'redact-pdf':
          result = await this.pdfEngine.redactPdf(this.uploadedFiles[0], [
            { pageNumber: 1, x: 100, y: 300, width: 250, height: 25 }
          ]);
          break;

        case 'jpg-to-pdf':
        case 'scan-to-pdf':
          result = await this.pdfEngine.imagesToPdf(this.uploadedFiles, this.imgOrientation, this.imgPageSize);
          break;

        case 'pdf-to-markdown':
          result = await this.pdfEngine.pdfToMarkdown(this.uploadedFiles[0]);
          break;

        case 'ai-summarizer':
          result = await this.pdfEngine.summarizePdf(this.uploadedFiles[0], this.summaryDetailLevel);
          break;

        default:
          result = await this.pdfEngine.compressPdf(this.uploadedFiles[0], 'recommended');
          result.fileName = `${this.uploadedFiles[0].name.replace(/\.[^/.]+$/, '')}_processed.pdf`;
          break;
      }

      this.progressPercent = 100;
      this.progressStatus = 'Finalizing download...';
      await new Promise(r => setTimeout(r, 200));

      // Successfully processed: increment daily usage count & save to history
      this.usageLimitService.incrementDailyUsage();
      this.historyService.addItem({
        toolSlug: this.tool.slug,
        toolName: this.tool.name,
        fileName: result.fileName,
        fileSizeFormatted: `${(result.newSize ? result.newSize / 1024 : this.uploadedFiles[0].size / 1024).toFixed(1)} KB`,
        status: 'completed',
        originalSize: result.originalSize,
        newSize: result.newSize
      });

      this.processedResult = result;
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err.message || 'An error occurred while processing the file. Please try again.';
    } finally {
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  }

  generateSampleSignatureImage(name: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = 'italic 32px "Brush Script MT", cursive, sans-serif';
      ctx.fillStyle = '#1e3a8a';
      ctx.fillText(name || 'Signature', 20, 60);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, 75);
      ctx.lineTo(280, 75);
      ctx.stroke();
    }
    return canvas.toDataURL('image/png');
  }

  downloadResult(): void {
    if (!this.processedResult || !this.processedResult.downloadUrl) return;
    const a = document.createElement('a');
    a.href = this.processedResult.downloadUrl;
    a.download = this.processedResult.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  copyOutputText(): void {
    if (!this.processedResult?.textOutput) return;
    navigator.clipboard.writeText(this.processedResult.textOutput);
  }
}
