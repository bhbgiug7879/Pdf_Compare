import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PdfDocument } from '../models/compare.model';

// Declare pdfjsLib in case it's loaded from global/window or npm
declare const pdfjsLib: any;

@Injectable({
  providedIn: 'root'
})
export class PdfExtractService {
  private pdfjsInitialized = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initPdfJs();
    }
  }

  private async initPdfJs(): Promise<any> {
    if (!this.isBrowser) {
      return null;
    }
    if (this.pdfjsInitialized && (window as any).pdfjsLib) {
      return (window as any).pdfjsLib;
    }

    try {
      // Try importing from node_modules pdfjs-dist
      const pdfjs = await import('pdfjs-dist');
      // Set worker
      if (pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      }
      (window as any).pdfjsLib = pdfjs;
      this.pdfjsInitialized = true;
      return pdfjs;
    } catch (e) {
      console.warn('Direct pdfjs-dist import fallback, using script or CDN if needed', e);
      return this.loadPdfJsFromCdn();
    }
  }

  private loadPdfJsFromCdn(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          this.pdfjsInitialized = true;
          resolve(lib);
        } else {
          reject(new Error('PDF.js library failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Could not load PDF.js script from CDN'));
      document.head.appendChild(script);
    });
  }

  /**
   * Process a File object into a PdfDocument with spatial text extraction and thumbnail preview
   */
  async extractPdf(file: File, id?: string): Promise<PdfDocument> {
    const docId = id || 'doc_' + Math.random().toString(36).substring(2, 9);
    const fileName = file.name;
    const fileSize = this.formatFileSize(file.size);

    try {
      const pdfLib = await this.initPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const numPages = pdf.numPages;
      let fullText = '';
      let thumbnail: string | undefined;

      // Extract text with horizontal & vertical layout preservation
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY: number | null = null;
        let lastX: number | null = null;
        let lastWidth: number = 0;
        let pageStr = '';

        for (const item of textContent.items) {
          if ('str' in item) {
            const currentX = item.transform[4];
            const currentY = item.transform[5];

            // Check if item is on a new line (vertical difference > 4pt)
            if (lastY !== null && Math.abs(currentY - lastY) > 4.5) {
              pageStr += '\n';
            } else if (pageStr.length > 0 && !pageStr.endsWith('\n')) {
              // Same line: check horizontal gap for tabular column separation
              const gap = (lastX !== null) ? currentX - (lastX + lastWidth) : 0;
              if (gap > 12) {
                pageStr += '  '; // Multi-space delimiter between table columns
              } else if (!pageStr.endsWith(' ')) {
                pageStr += ' ';
              }
            }

            pageStr += item.str;
            lastY = currentY;
            lastX = currentX;
            lastWidth = item.width || 0;
          }
        }

        fullText += (pageNum > 1 ? '\n\n' : '') + pageStr.trim();

        // Render page 1 to thumbnail canvas
        if (pageNum === 1) {
          thumbnail = await this.renderThumbnail(page);
        }
      }

      if (!fullText.trim()) {
        fullText = `[Scanned Document - Visual Page Content]\nFile: ${fileName}\nPages: ${numPages}\nNote: Text layer was not directly embeddable.`;
      }

      return {
        id: docId,
        fileName,
        fileSize,
        pageCount: numPages,
        content: fullText,
        thumbnail,
        file
      };
    } catch (err: any) {
      console.error('Error extracting PDF:', err);
      return {
        id: docId,
        fileName,
        fileSize,
        pageCount: 1,
        content: `Error parsing PDF binary streams: ${err?.message || 'Unknown error'}. You can also paste or edit text directly.`,
        file
      };
    }
  }

  private async renderThumbnail(page: any): Promise<string> {
    try {
      const viewport = page.getViewport({ scale: 0.35 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) return '';

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      console.warn('Could not generate canvas thumbnail', e);
      return '';
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
