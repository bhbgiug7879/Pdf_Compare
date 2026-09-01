import { Injectable } from '@angular/core';
import { CategoryInfo, ToolCategory, ToolDefinition } from '../models/tool.model';

@Injectable({
  providedIn: 'root'
})
export class ToolRegistryService {
  private categories: CategoryInfo[] = [
    {
      id: 'organize',
      name: 'Organize PDF',
      slug: 'organize',
      description: 'Merge, split, reorder, delete, and extract pages with complete ease.',
      icon: 'layers',
      color: '#6366f1',
      badge: '6 Tools'
    },
    {
      id: 'optimize',
      name: 'Optimize PDF',
      slug: 'optimize',
      description: 'Compress file size, reconstruct corrupted PDFs, and run OCR text extraction.',
      icon: 'zap',
      color: '#10b981',
      badge: '3 Tools'
    },
    {
      id: 'convert-to',
      name: 'Convert to PDF',
      slug: 'convert-to-pdf',
      description: 'Convert JPG, Word, PowerPoint, Excel, and HTML documents into clean PDFs.',
      icon: 'file-plus',
      color: '#3b82f6',
      badge: '5 Tools'
    },
    {
      id: 'convert-from',
      name: 'Convert from PDF',
      slug: 'convert-from-pdf',
      description: 'Transform PDFs into JPG images, Word docs, Excel spreadsheets, PPT, or PDF/A.',
      icon: 'file-text',
      color: '#f59e0b',
      badge: '5 Tools'
    },
    {
      id: 'edit',
      name: 'Edit PDF',
      slug: 'edit',
      description: 'Rotate pages, add custom page numbers, watermark, crop, and annotate.',
      icon: 'edit-3',
      color: '#ec4899',
      badge: '6 Tools'
    },
    {
      id: 'security',
      name: 'PDF Security & Diff',
      slug: 'security',
      description: 'Password protect, unlock, digital signatures, true redaction, and AI diff compare.',
      icon: 'shield',
      color: '#ef4444',
      badge: '5 Tools'
    },
    {
      id: 'intelligence',
      name: 'PDF Intelligence',
      slug: 'intelligence',
      description: 'AI-powered document summarization, multilingual translation, and Markdown exports.',
      icon: 'cpu',
      color: '#8b5cf6',
      badge: '3 Tools'
    }
  ];

  private tools: ToolDefinition[] = [
    // 1. ORGANIZE PDF
    {
      id: 'merge-pdf',
      slug: 'merge-pdf',
      name: 'Merge PDF',
      shortDescription: 'Combine multiple PDF files into a single unified document in seconds.',
      category: 'organize',
      icon: 'copy',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      accentColor: '#6366f1',
      badge: 'Most Popular',
      popular: true,
      acceptsMultipleFiles: true,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Merge PDFs Now',
      seoTitle: 'Merge PDF Online Free – Combine Multiple PDF Files Into One',
      metaDescription: 'Combine multiple PDF documents into one single file online for free. Drag and drop to reorder pages. Fast, secure, 100% client-side WASM processing.',
      keywords: ['merge pdf', 'combine pdfs', 'join pdf files', 'merge pdf online', 'pdf binder'],
      h1: 'Merge PDF Files Online For Free',
      heroSubtitle: 'Combine two or more PDF files into a single organized document. Fast, secure, and zero upload waiting time.',
      longDescription: 'Our Merge PDF tool lets you combine unlimited PDF documents into one seamless file directly in your browser. Rearrange documents by dragging thumbnails, discard unnecessary pages, and produce a clean unified PDF without uploading confidential files to any external server.',
      features: [
        { title: 'Interactive Reordering', desc: 'Drag and drop document cards to set the exact page sequence before merging.', icon: 'move' },
        { title: '100% Client-Side Privacy', desc: 'Processing runs locally using high-speed WASM. Your files never leave your device.', icon: 'shield-check' },
        { title: 'Preserves Quality & Bookmarks', desc: 'Retains original vector graphics, crisp typography, and document metadata.', icon: 'check-circle' }
      ],
      steps: [
        { title: 'Upload PDF Files', description: 'Select or drag & drop two or more PDF files you want to combine.' },
        { title: 'Arrange Order', description: 'Drag the document cards into your preferred sequence.' },
        { title: 'Download Merged PDF', description: 'Click "Merge PDFs Now" to instantly assemble and download your single PDF.' }
      ],
      faqs: [
        { question: 'Is there a limit on how many PDFs I can merge?', answer: 'No! Because processing is executed directly in your browser, you can merge multiple PDF documents without server file upload limits.' },
        { question: 'Will merging reduce the resolution or font quality?', answer: 'Not at all. The underlying PDF streams and vector coordinates are preserved identically.' },
        { question: 'Are my private files stored on any server?', answer: 'Never. All merge computations happen 100% client-side inside your web browser.' }
      ],
      relatedToolSlugs: ['split-pdf', 'organize-pdf', 'compress-pdf', 'add-page-numbers']
    },
    {
      id: 'split-pdf',
      slug: 'split-pdf',
      name: 'Split PDF',
      shortDescription: 'Split a large PDF into independent files by custom page ranges or single pages.',
      category: 'organize',
      icon: 'scissors',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      accentColor: '#6366f1',
      badge: 'Fast',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Split PDF Now',
      seoTitle: 'Split PDF Online Free – Extract Pages & Split by Range',
      metaDescription: 'Separate one or multiple pages from your PDF file. Split by custom ranges (e.g. 1-4, 5-8) or extract individual pages instantly.',
      keywords: ['split pdf', 'separate pdf pages', 'extract pdf pages', 'split pdf online free'],
      h1: 'Split PDF Documents by Page Range',
      heroSubtitle: 'Break down large PDF files into bite-sized documents or extract exact page ranges with instant client-side splitting.',
      longDescription: 'Easily separate PDF documents by specifying comma-separated page ranges (e.g. 1-3, 5, 8-12) or splitting every N pages. Perfect for isolating contracts, invoices, chapters, or reports.',
      features: [
        { title: 'Custom Range Syntax', desc: 'Specify flexible ranges like 1-5, 8, 12-20 to generate tailored output documents.', icon: 'sliders' },
        { title: 'Visual Page Previews', desc: 'Inspect high-resolution page thumbnails before deciding where to split.', icon: 'eye' },
        { title: 'Zero Compression Loss', desc: 'Streams are extracted cleanly without re-encoding, preserving pristine clarity.', icon: 'zap' }
      ],
      steps: [
        { title: 'Upload Document', description: 'Choose the PDF file you wish to divide.' },
        { title: 'Set Page Ranges', description: 'Enter the page numbers (e.g. 1-3, 4-10) or choose to split every page.' },
        { title: 'Download Split PDFs', description: 'Hit "Split PDF Now" to receive your separated files immediately.' }
      ],
      faqs: [
        { question: 'How do I specify multiple ranges?', answer: 'You can type syntax like "1-3, 5, 7-10". Each range will be extracted into a designated PDF.' },
        { question: 'Can I split password-protected PDFs?', answer: 'Use our Unlock PDF tool first to remove the password, then split as needed.' }
      ],
      relatedToolSlugs: ['merge-pdf', 'extract-pages', 'remove-pages', 'organize-pdf']
    },
    {
      id: 'remove-pages',
      slug: 'remove-pages',
      name: 'Remove Pages',
      shortDescription: 'Delete unwanted pages from your PDF file with one click.',
      category: 'organize',
      icon: 'trash-2',
      iconBg: 'rgba(239, 68, 68, 0.15)',
      accentColor: '#ef4444',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Remove Selected Pages',
      seoTitle: 'Delete & Remove PDF Pages Online Free',
      metaDescription: 'Quickly remove blank or unnecessary pages from your PDF. Visual thumbnail selection and instant browser-side deletion.',
      keywords: ['remove pdf pages', 'delete pages from pdf', 'delete pdf page free'],
      h1: 'Delete Unwanted Pages From Your PDF',
      heroSubtitle: 'Click the pages you want gone and download your clean PDF in seconds.',
      longDescription: 'Remove accidental blank pages, duplicate slides, or sensitive disclosures with visual page selection. Just click thumbnail boxes to mark for deletion and export the trimmed document.',
      features: [
        { title: 'Visual Selection Grid', desc: 'Click any thumbnail to flag it for removal with red badge highlight.', icon: 'grid' },
        { title: 'Instant Preview', desc: 'Verify which pages remain before finalizing your download.', icon: 'check-square' },
        { title: 'Safe & Secure', desc: 'Everything processes locally in memory; no files sent over the internet.', icon: 'lock' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the PDF document containing pages you want to remove.' },
        { title: 'Select Pages to Discard', description: 'Click the thumbnails of the pages you want deleted.' },
        { title: 'Download Clean PDF', description: 'Click "Remove Selected Pages" to save the updated PDF.' }
      ],
      faqs: [
        { question: 'Can I undo a page removal?', answer: 'Yes! Simply click a selected page thumbnail again to uncheck it before exporting.' }
      ],
      relatedToolSlugs: ['extract-pages', 'organize-pdf', 'split-pdf', 'rotate-pdf']
    },
    {
      id: 'extract-pages',
      slug: 'extract-pages',
      name: 'Extract Pages',
      shortDescription: 'Pull out specific pages from a PDF to create a brand new document.',
      category: 'organize',
      icon: 'download',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      accentColor: '#6366f1',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Extract Pages Now',
      seoTitle: 'Extract Pages from PDF Online Free',
      metaDescription: 'Extract one or multiple pages from your PDF file into a new standalone PDF document. Fast and completely free.',
      keywords: ['extract pdf pages', 'pull pages from pdf', 'save specific pages pdf'],
      h1: 'Extract Specific Pages From Any PDF',
      heroSubtitle: 'Create a new focused PDF containing only the exact pages you choose.',
      longDescription: 'Select key slides, contract signatures, or table of contents pages from a massive PDF to export as a clean, lightweight standalone document.',
      features: [
        { title: 'Thumbnail Multi-Select', desc: 'Click individual thumbnails or input range numbers.', icon: 'check-circle' },
        { title: 'Instant Assembly', desc: 'Compiled in milliseconds in the browser using WASM.', icon: 'zap' },
        { title: 'Lossless Quality', desc: 'Zero degradation in visual fidelity or text searchability.', icon: 'award' }
      ],
      steps: [
        { title: 'Upload File', description: 'Choose the PDF from which you need pages extracted.' },
        { title: 'Pick Pages', description: 'Click on the pages you want to keep in the new PDF.' },
        { title: 'Export', description: 'Click "Extract Pages Now" to download your curated PDF.' }
      ],
      faqs: [
        { question: 'Can I extract non-consecutive pages?', answer: 'Yes, select any combination of pages (e.g. pages 2, 7, and 19) into one new PDF.' }
      ],
      relatedToolSlugs: ['remove-pages', 'split-pdf', 'organize-pdf', 'merge-pdf']
    },
    {
      id: 'organize-pdf',
      slug: 'organize-pdf',
      name: 'Organize PDF',
      shortDescription: 'Drag-and-drop page reordering, individual page rotation, and deletions in one visual workspace.',
      category: 'organize',
      icon: 'grid',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      accentColor: '#6366f1',
      badge: 'Interactive',
      popular: true,
      acceptsMultipleFiles: true,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Save Organized PDF',
      seoTitle: 'Organize PDF Online – Reorder, Rotate & Delete Pages',
      metaDescription: 'Visual page organizer for PDF files. Drag and drop pages to reorder, rotate individual sheets, and delete unwanted pages.',
      keywords: ['organize pdf', 'reorder pdf pages', 'rearrange pdf', 'sort pdf pages'],
      h1: 'Visual Drag-and-Drop PDF Organizer',
      heroSubtitle: 'Reorder pages, rotate misaligned sheets, and delete unwanted pages in one sleek visual editor.',
      longDescription: 'Take full control of your document structure. View thumbnails for every page, drag to reorder, click rotation buttons to fix orientation, and discard pages in real time.',
      features: [
        { title: 'Drag-to-Reorder Grid', desc: 'Smooth drag-and-drop interactions to rearrange pages effortlessly.', icon: 'move' },
        { title: 'Per-Page Rotation', desc: 'Rotate single pages clockwise 90°/180°/270° without affecting other pages.', icon: 'rotate-cw' },
        { title: 'Multi-Document Merge & Sort', desc: 'Upload multiple PDFs simultaneously and arrange all their pages together.', icon: 'layers' }
      ],
      steps: [
        { title: 'Upload Documents', description: 'Drop one or more PDF files into the workspace.' },
        { title: 'Rearrange & Rotate', description: 'Drag thumbnails to reorder and use the rotate/trash icons per page.' },
        { title: 'Download', description: 'Click "Save Organized PDF" to export your finalized document.' }
      ],
      faqs: [
        { question: 'Can I rotate just one upside-down page?', answer: 'Yes! Hover over the specific page thumbnail and click the rotate icon.' }
      ],
      relatedToolSlugs: ['rotate-pdf', 'merge-pdf', 'remove-pages', 'split-pdf']
    },
    {
      id: 'scan-to-pdf',
      slug: 'scan-to-pdf',
      name: 'Scan to PDF',
      shortDescription: 'Capture documents with your camera or photos and compile into crisp, clean PDFs.',
      category: 'organize',
      icon: 'camera',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      accentColor: '#6366f1',
      badge: 'Mobile First',
      acceptsMultipleFiles: true,
      acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
      ctaText: 'Generate Scanned PDF',
      seoTitle: 'Scan to PDF Online Free – Camera & Image Document Scanner',
      metaDescription: 'Turn paper documents and camera photos into high quality PDF files. Auto contrast enhancement and multi-page compilation.',
      keywords: ['scan to pdf', 'camera to pdf', 'scan document online', 'photo to pdf scanner'],
      h1: 'Scan Documents Directly to PDF',
      heroSubtitle: 'Use your phone camera or upload receipt photos to create clean, multi-page PDFs with automatic contrast cleanup.',
      longDescription: 'Transform physical documents, receipts, whiteboards, and handwritten notes into professional PDF files with automatic contrast adjustment and page fitting.',
      features: [
        { title: 'Direct Camera Capture', desc: 'Tap to snap photos directly from your smartphone or laptop webcam.', icon: 'camera' },
        { title: 'Document Filters', desc: 'B&W, Grayscale, and High-Contrast document enhancement modes.', icon: 'sliders' },
        { title: 'Multi-Page Stitching', desc: 'Combine multiple captured pages into a single cohesive document.', icon: 'layers' }
      ],
      steps: [
        { title: 'Capture or Upload', description: 'Take photos with your camera or select image files.' },
        { title: 'Adjust Filters', description: 'Apply contrast filters and set page orientation.' },
        { title: 'Generate PDF', description: 'Click "Generate Scanned PDF" to download your ready-to-share document.' }
      ],
      faqs: [
        { question: 'Does this work on mobile browsers?', answer: 'Yes, it accesses your mobile camera seamlessly via modern HTML5 Media capture.' }
      ],
      relatedToolSlugs: ['jpg-to-pdf', 'ocr-pdf', 'compress-pdf', 'organize-pdf']
    },

    // 2. OPTIMIZE PDF
    {
      id: 'compress-pdf',
      slug: 'compress-pdf',
      name: 'Compress PDF',
      shortDescription: 'Reduce PDF file size while maintaining the highest possible visual clarity.',
      category: 'optimize',
      icon: 'minimize-2',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      accentColor: '#10b981',
      badge: 'Up to 85% Savings',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Compress PDF Now',
      seoTitle: 'Compress PDF Online Free – Reduce File Size Without Quality Loss',
      metaDescription: 'Shrink large PDF documents online for free. Choose Extreme, Recommended, or Light compression. Fast, private, browser-based compression.',
      keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf size reducer online'],
      h1: 'Compress PDF File Size Online',
      heroSubtitle: 'Reduce bloated PDF files to lightweight documents ready for email attachments and web upload.',
      longDescription: 'Compress heavy PDF files without sacrificing text crispness or image readability. Choose between Extreme, Recommended, and High Quality compression presets and see real-time byte savings.',
      features: [
        { title: '3 Smart Compression Presets', desc: 'Extreme (maximum size reduction), Recommended (best balance), and Light.', icon: 'sliders' },
        { title: 'Real-Time Before/After Size', desc: 'See the exact percentage of space saved before and after compression.', icon: 'trending-down' },
        { title: 'Email & Portal Ready', desc: 'Safely shrinks files to fit under standard 10MB or 25MB email attachment limits.', icon: 'mail' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the large PDF file you want to compress.' },
        { title: 'Select Compression Level', description: 'Pick Recommended, Extreme, or Light compression.' },
        { title: 'Download & Compare', description: 'Click "Compress PDF Now" and enjoy your slimmed-down file.' }
      ],
      faqs: [
        { question: 'Will compressing my PDF make text blurry?', answer: 'No. Text streams remain razor-sharp vectors. Compression intelligently optimizes embedded images and stream redundancies.' }
      ],
      relatedToolSlugs: ['merge-pdf', 'repair-pdf', 'pdf-to-jpg', 'organize-pdf']
    },
    {
      id: 'repair-pdf',
      slug: 'repair-pdf',
      name: 'Repair PDF',
      shortDescription: 'Recover and fix damaged, corrupted, or unreadable PDF documents.',
      category: 'optimize',
      icon: 'tool',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      accentColor: '#10b981',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Repair PDF Document',
      seoTitle: 'Repair Corrupted PDF Online Free – Fix Damaged PDF Files',
      metaDescription: 'Reconstruct unreadable or corrupted PDF files. Rebuild cross-reference tables and recover inaccessible pages.',
      keywords: ['repair pdf', 'fix corrupted pdf', 'recover damaged pdf', 'restore pdf file'],
      h1: 'Repair & Recover Damaged PDF Files',
      heroSubtitle: 'Reconstruct broken cross-reference tables, repair trailer streams, and salvage unreadable PDF data.',
      longDescription: 'Encountering "file damaged or corrupted" errors? Our repair engine scans for intact object streams, synthesizes missing xref tables, and reconstructs a healthy PDF document.',
      features: [
        { title: 'XRef Table Reconstruction', desc: 'Rebuilds broken index pointers that prevent viewers from opening files.', icon: 'database' },
        { title: 'Stream De-duplication', desc: 'Recovers readable page fragments and object dictionaries.', icon: 'refresh-cw' },
        { title: 'Zero Data Harvesting', desc: 'All recovery routines execute in your private browser sandbox.', icon: 'shield-check' }
      ],
      steps: [
        { title: 'Upload Damaged PDF', description: 'Select the corrupted file that fails to open properly.' },
        { title: 'Run Diagnostics', description: 'Our WASM engine analyzes header and object stream integrity.' },
        { title: 'Download Repaired PDF', description: 'Save the restored, fully readable PDF file.' }
      ],
      faqs: [
        { question: 'Can all damaged PDFs be repaired?', answer: 'Files with intact stream objects can almost always be reconstructed. Severe total file truncations might have partial page loss.' }
      ],
      relatedToolSlugs: ['compress-pdf', 'unlock-pdf', 'organize-pdf', 'split-pdf']
    },
    {
      id: 'ocr-pdf',
      slug: 'ocr-pdf',
      name: 'OCR PDF',
      shortDescription: 'Convert scanned image PDFs into searchable, selectable, and copyable text documents.',
      category: 'optimize',
      icon: 'file-text',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      accentColor: '#10b981',
      badge: 'Multilingual',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf', '.jpg', '.png'],
      ctaText: 'Run OCR & Make Searchable',
      seoTitle: 'OCR PDF Online Free – Make Scanned PDFs Searchable',
      metaDescription: 'Optical Character Recognition (OCR) for scanned PDFs and image files. Extract text layers and make documents searchable in English, Spanish, French, and more.',
      keywords: ['ocr pdf', 'searchable pdf', 'extract text from scanned pdf', 'optical character recognition pdf'],
      h1: 'Make Scanned PDFs Searchable with OCR',
      heroSubtitle: 'Extract text layers from flat scanned images so you can search, copy, highlight, and translate content.',
      longDescription: 'Turn flat scanned pages into dynamic searchable documents. OCR analyzes character glyphs and injects an invisible text layer directly aligned with your original document layout.',
      features: [
        { title: 'Multi-Language Support', desc: 'Recognizes English, Spanish, French, German, Italian, Portuguese, and more.', icon: 'globe' },
        { title: 'Copy & Search Enabled', desc: 'Use Ctrl+F / Cmd+F in any PDF viewer to quickly find words in scanned documents.', icon: 'search' },
        { title: 'Maintains Original Layout', desc: 'Text coordinates match the underlying visual scans with pixel accuracy.', icon: 'layout' }
      ],
      steps: [
        { title: 'Upload Scanned File', description: 'Select your scanned PDF or photo document.' },
        { title: 'Choose Language', description: 'Select the document language for highest recognition accuracy.' },
        { title: 'Download Searchable PDF', description: 'Download your interactive, searchable PDF.' }
      ],
      faqs: [
        { question: 'Can I copy text out of the OCR result?', answer: 'Yes! The resulting PDF has full selectable text that can be copied directly into Word, Notepad, or emails.' }
      ],
      relatedToolSlugs: ['scan-to-pdf', 'pdf-to-word', 'pdf-to-markdown', 'ai-summarizer']
    },

    // 3. CONVERT TO PDF
    {
      id: 'jpg-to-pdf',
      slug: 'jpg-to-pdf',
      name: 'JPG to PDF',
      shortDescription: 'Convert JPG, PNG, and WebP images into a single clean PDF document.',
      category: 'convert-to',
      icon: 'image',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      accentColor: '#3b82f6',
      badge: 'Popular',
      popular: true,
      acceptsMultipleFiles: true,
      acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
      ctaText: 'Convert Images to PDF',
      seoTitle: 'Convert JPG to PDF Online Free – Images to PDF Converter',
      metaDescription: 'Convert JPG, PNG, and image files to PDF online. Customize page margins, orientation (portrait/landscape), and page sizes (A4, Letter).',
      keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'convert photo to pdf'],
      h1: 'Convert JPG & PNG Images to PDF',
      heroSubtitle: 'Combine photos, scans, and graphic images into a single, beautifully formatted PDF document.',
      longDescription: 'Quickly assemble photos into a unified document. Configure page layout (Fit to Page, A4, Letter), adjust margins, select portrait or landscape orientation, and download in a snap.',
      features: [
        { title: 'Multi-Image Batching', desc: 'Upload 10+ photos at once and compile them into a multi-page PDF.', icon: 'layers' },
        { title: 'Layout Customization', desc: 'Choose page dimensions (A4, Letter, Auto), margins, and orientation.', icon: 'layout' },
        { title: 'Full Resolution Preservation', desc: 'Images maintain maximum sharpness and color depth.', icon: 'award' }
      ],
      steps: [
        { title: 'Upload Images', description: 'Select JPG, PNG, or WebP files from your computer or phone.' },
        { title: 'Set Page Options', description: 'Adjust page orientation, sizing, and margin spacing.' },
        { title: 'Download PDF', description: 'Click "Convert Images to PDF" to get your consolidated document.' }
      ],
      faqs: [
        { question: 'Can I reorder images before converting?', answer: 'Yes, you can drag and drop image cards to arrange them in exact order.' }
      ],
      relatedToolSlugs: ['pdf-to-jpg', 'scan-to-pdf', 'organize-pdf', 'compress-pdf']
    },
    {
      id: 'word-to-pdf',
      slug: 'word-to-pdf',
      name: 'Word to PDF',
      shortDescription: 'Convert Microsoft Word documents (.docx, .doc) to crisp, read-only PDFs.',
      category: 'convert-to',
      icon: 'file-text',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      accentColor: '#3b82f6',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.docx', '.doc', '.rtf', '.txt'],
      ctaText: 'Convert Word to PDF',
      seoTitle: 'Word to PDF Converter Online Free – DOCX to PDF',
      metaDescription: 'Convert Word DOC and DOCX files into PDF format online for free. Preserves typography, tables, and alignment perfectly.',
      keywords: ['word to pdf', 'docx to pdf', 'convert doc to pdf', 'word document to pdf'],
      h1: 'Convert Word Documents to PDF',
      heroSubtitle: 'Preserve your document formatting, fonts, and tables across any device with a flawless PDF conversion.',
      longDescription: 'Transform Microsoft Word documents into universal PDF files that look identical on Windows, Mac, iOS, Android, and Linux. No formatting shifts or missing font problems.',
      features: [
        { title: 'Preserves Layout & Styles', desc: 'Headers, bullet lists, tables, and typography stay precisely positioned.', icon: 'check-circle' },
        { title: 'Universal Compatibility', desc: 'Share documents with clients without worrying whether they have MS Office.', icon: 'globe' },
        { title: 'Fast & Private', desc: 'Quick processing with strict data privacy.', icon: 'lock' }
      ],
      steps: [
        { title: 'Upload DOCX File', description: 'Choose your Word document.' },
        { title: 'Automatic Conversion', description: 'Our conversion engine processes styles and structure.' },
        { title: 'Download PDF', description: 'Save your polished PDF ready for signing or sharing.' }
      ],
      faqs: [
        { question: 'Will my embedded images and tables look right?', answer: 'Yes, all tables, images, and formatting are converted with faithful layout accuracy.' }
      ],
      relatedToolSlugs: ['pdf-to-word', 'excel-to-pdf', 'powerpoint-to-pdf', 'merge-pdf']
    },
    {
      id: 'powerpoint-to-pdf',
      slug: 'powerpoint-to-pdf',
      name: 'PowerPoint to PDF',
      shortDescription: 'Convert PowerPoint slide presentations (.pptx, .ppt) to PDF slides.',
      category: 'convert-to',
      icon: 'airplay',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      accentColor: '#3b82f6',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pptx', '.ppt'],
      ctaText: 'Convert PPT to PDF',
      seoTitle: 'PowerPoint to PDF Online Free – PPTX to PDF Converter',
      metaDescription: 'Convert PowerPoint presentations to PDF online. Each slide is converted into a crisp, high-resolution PDF page.',
      keywords: ['powerpoint to pdf', 'pptx to pdf', 'convert slides to pdf', 'ppt to pdf online'],
      h1: 'Convert PowerPoint Slides to PDF',
      heroSubtitle: 'Turn presentation slide decks into lightweight, distributable PDF handouts.',
      longDescription: 'Convert slide decks from PowerPoint into clean PDFs suitable for client handouts, conference presentations, and email distribution without animation glitches.',
      features: [
        { title: '1-to-1 Slide Mapping', desc: 'Each presentation slide becomes a dedicated, full-bleed PDF page.', icon: 'layers' },
        { title: 'Graphic & Font Preservation', desc: 'Charts, diagrams, and custom fonts are rendered crisply.', icon: 'pie-chart' }
      ],
      steps: [
        { title: 'Upload Presentation', description: 'Select your .pptx or .ppt slide deck.' },
        { title: 'Convert', description: 'Engine renders slide vectors and text hierarchy.' },
        { title: 'Download PDF Deck', description: 'Download your finalized PDF document.' }
      ],
      faqs: [
        { question: 'Can I convert large slide decks with 50+ slides?', answer: 'Yes! Slide decks are processed smoothly without slide limits.' }
      ],
      relatedToolSlugs: ['pdf-to-powerpoint', 'word-to-pdf', 'compress-pdf', 'organize-pdf']
    },
    {
      id: 'excel-to-pdf',
      slug: 'excel-to-pdf',
      name: 'Excel to PDF',
      shortDescription: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) into paginated PDF tables.',
      category: 'convert-to',
      icon: 'table',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      accentColor: '#3b82f6',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.xlsx', '.xls', '.csv'],
      ctaText: 'Convert Excel to PDF',
      seoTitle: 'Excel to PDF Online Free – XLSX to PDF Converter',
      metaDescription: 'Convert Excel spreadsheets and CSV data to formatted PDF documents. Perfect for invoices, financial reports, and data sheets.',
      keywords: ['excel to pdf', 'xlsx to pdf', 'convert spreadsheet to pdf', 'csv to pdf'],
      h1: 'Convert Excel Spreadsheets to PDF',
      heroSubtitle: 'Transform complex workbooks and data tables into neatly aligned, printable PDF sheets.',
      longDescription: 'Turn spreadsheets, invoices, financial budgets, and data tables into cleanly paginated PDF documents that maintain column widths and gridline borders.',
      features: [
        { title: 'Smart Table Auto-Fit', desc: 'Adjusts column dimensions to prevent awkward cell wrapping across page breaks.', icon: 'columns' },
        { title: 'CSV & XLSX Support', desc: 'Compatible with all modern Excel formats and delimited data.', icon: 'file-text' }
      ],
      steps: [
        { title: 'Upload Spreadsheet', description: 'Select your Excel or CSV file.' },
        { title: 'Page Fit Options', description: 'Choose portrait or landscape sheet orientation.' },
        { title: 'Download PDF Report', description: 'Save your cleanly formatted PDF.' }
      ],
      faqs: [
        { question: 'Will wide spreadsheets be cut off?', answer: 'Our auto-fit algorithm optimizes page orientation to keep all columns visible.' }
      ],
      relatedToolSlugs: ['pdf-to-excel', 'word-to-pdf', 'compare-pdf', 'compress-pdf']
    },
    {
      id: 'html-to-pdf',
      slug: 'html-to-pdf',
      name: 'HTML to PDF',
      shortDescription: 'Convert web pages via URL input or raw HTML code into printable PDF files.',
      category: 'convert-to',
      icon: 'code',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      accentColor: '#3b82f6',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.html', '.htm', '.txt'],
      ctaText: 'Convert HTML to PDF',
      seoTitle: 'HTML to PDF Converter Online Free – Webpage URL to PDF',
      metaDescription: 'Convert HTML code or live webpage URLs to PDF documents online. Preserves CSS styling, images, and fonts.',
      keywords: ['html to pdf', 'url to pdf', 'webpage to pdf', 'convert website to pdf'],
      h1: 'Convert HTML & Webpages to PDF',
      heroSubtitle: 'Generate pixel-perfect PDF documents from web URLs or custom HTML/CSS code snippets.',
      longDescription: 'Convert live web pages, documentation articles, or custom HTML templates into PDF documents with full styling, typography, and image preservation.',
      features: [
        { title: 'URL or Raw Code Input', desc: 'Paste a website URL or upload your custom HTML/CSS file directly.', icon: 'globe' },
        { title: 'CSS & Flexbox Support', desc: 'Renders modern CSS styles, colors, and layout models accurately.', icon: 'layout' }
      ],
      steps: [
        { title: 'Enter URL or HTML', description: 'Provide the webpage URL or upload the HTML file.' },
        { title: 'Format Options', description: 'Select page format (A4/Letter) and margin preferences.' },
        { title: 'Download PDF', description: 'Save the rendered PDF.' }
      ],
      faqs: [
        { question: 'Can I convert password-protected web pages?', answer: 'You can upload the raw HTML source code directly if the URL requires session authentication.' }
      ],
      relatedToolSlugs: ['word-to-pdf', 'jpg-to-pdf', 'pdf-to-markdown', 'ai-summarizer']
    },

    // 4. CONVERT FROM PDF
    {
      id: 'pdf-to-jpg',
      slug: 'pdf-to-jpg',
      name: 'PDF to JPG',
      shortDescription: 'Extract PDF pages into high-resolution JPG images or download as a ZIP.',
      category: 'convert-from',
      icon: 'image',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      accentColor: '#f59e0b',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Convert PDF to Images',
      seoTitle: 'PDF to JPG Converter Online Free – Convert PDF to Image High Quality',
      metaDescription: 'Convert PDF pages into high quality JPG or PNG images online. Download individual pages or entire document in a single ZIP.',
      keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpeg', 'pdf to png online'],
      h1: 'Convert PDF Pages to JPG Images',
      heroSubtitle: 'Render every page of your PDF into crisp, high-resolution JPEG images in seconds.',
      longDescription: 'Need to share PDF slides on social media or embed pages into presentations? Convert each PDF page into crisp JPG or PNG images with custom DPI settings.',
      features: [
        { title: 'High-Res DPI Rendering', desc: 'Crisp rendering up to 300 DPI for crystal clear typography and charts.', icon: 'eye' },
        { title: 'Individual or ZIP Download', desc: 'Download specific page images or bundle all pages into a convenient ZIP archive.', icon: 'package' },
        { title: '100% Client Side', desc: 'Rendered directly via HTML5 Canvas in your browser without server lag.', icon: 'zap' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the PDF you wish to convert into images.' },
        { title: 'Choose Image Format', description: 'Pick JPG or PNG and select your desired image quality.' },
        { title: 'Download Images', description: 'Click "Convert PDF to Images" and download your files.' }
      ],
      faqs: [
        { question: 'Can I convert only specific pages?', answer: 'Yes, you can view the page previews and download only the images you need.' }
      ],
      relatedToolSlugs: ['jpg-to-pdf', 'extract-pages', 'crop-pdf', 'compress-pdf']
    },
    {
      id: 'pdf-to-word',
      slug: 'pdf-to-word',
      name: 'PDF to Word',
      shortDescription: 'Convert PDF documents into fully editable Microsoft Word (.docx) files.',
      category: 'convert-from',
      icon: 'file-text',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      accentColor: '#f59e0b',
      badge: 'Popular',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Convert to Word DOCX',
      seoTitle: 'PDF to Word Converter Online Free – PDF to Editable DOCX',
      metaDescription: 'Convert PDF files to editable Microsoft Word (.docx) documents online for free. Extracts text, tables, and formatting accurately.',
      keywords: ['pdf to word', 'pdf to docx', 'convert pdf to word online free', 'editable pdf to word'],
      h1: 'Convert PDF to Editable Word (DOCX)',
      heroSubtitle: 'Extract text, paragraphs, and tables from PDF documents into easily editable Word files.',
      longDescription: 'Say goodbye to tedious retyping. Convert PDF contracts, resumes, and reports into Microsoft Word files with preserved paragraph structure and headings.',
      features: [
        { title: 'Editable Text Streams', desc: 'Modify text, change fonts, and adjust bullet points in Microsoft Word or Google Docs.', icon: 'edit' },
        { title: 'Table Extraction', desc: 'Converts PDF table grids into editable Word table cells.', icon: 'grid' },
        { title: 'Zero File Leakage', desc: 'Strict security ensuring your confidential contracts remain private.', icon: 'shield-check' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select your PDF document.' },
        { title: 'Automatic Extraction', description: 'Our layout parser reconstructs text blocks and document flows.' },
        { title: 'Download DOCX', description: 'Save and open your editable Word document.' }
      ],
      faqs: [
        { question: 'Is the downloaded Word document fully editable?', answer: 'Yes, all text, headings, and tables are 100% editable in MS Word, Google Docs, and LibreOffice.' }
      ],
      relatedToolSlugs: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-markdown', 'ocr-pdf']
    },
    {
      id: 'pdf-to-powerpoint',
      slug: 'pdf-to-powerpoint',
      name: 'PDF to PowerPoint',
      shortDescription: 'Transform PDF pages into editable PowerPoint (.pptx) presentation slides.',
      category: 'convert-from',
      icon: 'airplay',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      accentColor: '#f59e0b',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Convert to PowerPoint PPTX',
      seoTitle: 'PDF to PowerPoint Online Free – Convert PDF to PPTX',
      metaDescription: 'Convert PDF presentations into editable PowerPoint (.pptx) slides online. Keep formatting and visual layouts intact.',
      keywords: ['pdf to powerpoint', 'pdf to pptx', 'convert pdf to slides', 'pdf presentation to ppt'],
      h1: 'Convert PDF to PowerPoint (PPTX)',
      heroSubtitle: 'Reclaim your presentation slides with clean PDF to PowerPoint slide conversion.',
      longDescription: 'Turn static PDF slide handouts back into an editable slide deck with slide dimensions formatted for standard 16:9 widescreen or 4:3 presentation screens.',
      features: [
        { title: 'Slide-by-Slide Conversion', desc: 'Preserves slide sequence and visual compositions accurately.', icon: 'layers' },
        { title: 'Editable Deck Output', desc: 'Open and present directly in PowerPoint, Keynote, or Google Slides.', icon: 'check-circle' }
      ],
      steps: [
        { title: 'Upload PDF Deck', description: 'Select the PDF slide file.' },
        { title: 'Slide Processing', description: 'Engine translates pages into PPTX slide containers.' },
        { title: 'Download PPTX', description: 'Download your editable slide presentation.' }
      ],
      faqs: [
        { question: 'Can I edit the converted slides in Google Slides?', answer: 'Yes, the generated PPTX file opens seamlessly in both Microsoft PowerPoint and Google Slides.' }
      ],
      relatedToolSlugs: ['powerpoint-to-pdf', 'pdf-to-jpg', 'pdf-to-word', 'organize-pdf']
    },
    {
      id: 'pdf-to-excel',
      slug: 'pdf-to-excel',
      name: 'PDF to Excel',
      shortDescription: 'Extract tables, rows, and numerical data from PDF into Excel (.xlsx, .csv).',
      category: 'convert-from',
      icon: 'table',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      accentColor: '#f59e0b',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Extract to Excel Spreadsheet',
      seoTitle: 'PDF to Excel Converter Online Free – PDF to XLSX & CSV',
      metaDescription: 'Extract tables and structured data from PDF invoices and bank statements into editable Excel spreadsheets (.xlsx, .csv).',
      keywords: ['pdf to excel', 'pdf to xlsx', 'extract tables from pdf', 'pdf to csv converter'],
      h1: 'Convert PDF Tables to Excel (XLSX / CSV)',
      heroSubtitle: 'Extract financial statements, invoices, and data tables from PDF into structured spreadsheets.',
      longDescription: 'Stop manually copying numbers cell by cell. Our table extraction algorithms detect cell boundaries, alignment, and numerical values to produce clean spreadsheets.',
      features: [
        { title: 'Automatic Table Boundary Detection', desc: 'Detects row and column lines to map table structures accurately.', icon: 'grid' },
        { title: 'Formulas & Numbers Ready', desc: 'Numbers are preserved in raw numeric formats ready for Excel formulas and SUM functions.', icon: 'dollar-sign' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Choose the PDF containing tables or bank statements.' },
        { title: 'Table Detection', description: 'Our engine identifies rows, columns, and data cells.' },
        { title: 'Download Spreadsheet', description: 'Download your XLSX or CSV file.' }
      ],
      faqs: [
        { question: 'Does this work on multi-page invoices?', answer: 'Yes, all tables across consecutive pages are consolidated into structured worksheets.' }
      ],
      relatedToolSlugs: ['excel-to-pdf', 'pdf-to-word', 'compare-pdf', 'ocr-pdf']
    },
    {
      id: 'pdf-to-pdfa',
      slug: 'pdf-to-pdfa',
      name: 'PDF to PDF/A',
      shortDescription: 'Convert standard PDF documents into ISO-compliant PDF/A archival format.',
      category: 'convert-from',
      icon: 'archive',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      accentColor: '#f59e0b',
      badge: 'ISO Standard',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Convert to PDF/A',
      seoTitle: 'Convert PDF to PDF/A Online Free – Long-Term Archival Format',
      metaDescription: 'Convert PDF documents into ISO-standard PDF/A-1b or PDF/A-2b format for guaranteed long-term digital preservation and legal compliance.',
      keywords: ['pdf to pdfa', 'pdf/a converter', 'archival pdf', 'pdf a compliance'],
      h1: 'Convert PDF to PDF/A Archival Format',
      heroSubtitle: 'Ensure your legal contracts, medical records, and tax filings remain readable decades into the future.',
      longDescription: 'PDF/A is the international ISO standard for long-term document archiving. It embeds color profiles, fonts, and device-independent metadata so documents look identical forever.',
      features: [
        { title: 'Embedded Font Subsets', desc: 'Embeds missing typography to guarantee future renderability.', icon: 'type' },
        { title: 'Device-Independent Color', desc: 'Standardizes color profiles to standard sRGB / ICC profiles.', icon: 'aperture' },
        { title: 'Legal & Tax Compliance', desc: 'Meets stringent archiving mandates for courts, governments, and enterprises.', icon: 'check-circle' }
      ],
      steps: [
        { title: 'Upload Document', description: 'Select the PDF file for archiving.' },
        { title: 'PDF/A Profile', description: 'Standardizes metadata and embeds font streams.' },
        { title: 'Download Compliant PDF/A', description: 'Save your certified archival document.' }
      ],
      faqs: [
        { question: 'Why is PDF/A required for legal filings?', answer: 'PDF/A bans dynamic scripts and external font dependencies, ensuring the document cannot degrade or alter over decades.' }
      ],
      relatedToolSlugs: ['protect-pdf', 'sign-pdf', 'compress-pdf', 'merge-pdf']
    },

    // 5. EDIT PDF
    {
      id: 'rotate-pdf',
      slug: 'rotate-pdf',
      name: 'Rotate PDF',
      shortDescription: 'Rotate individual pages or entire documents 90°, 180°, or 270° permanently.',
      category: 'edit',
      icon: 'rotate-cw',
      iconBg: 'rgba(236, 72, 153, 0.15)',
      accentColor: '#ec4899',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Apply Rotation & Download',
      seoTitle: 'Rotate PDF Online Free – Rotate All or Single Pages Permanently',
      metaDescription: 'Rotate PDF files permanently online for free. Rotate 90 degrees clockwise, counterclockwise, or upside-down 180 degrees. Visual thumbnail selector.',
      keywords: ['rotate pdf', 'rotate pdf pages', 'turn pdf sideways', 'flip pdf upside down'],
      h1: 'Rotate PDF Pages Permanently',
      heroSubtitle: 'Fix sideways or upside-down scanned pages with one-click visual rotation tools.',
      longDescription: 'Fix orientation issues in seconds. Rotate all pages at once or click individual page cards to turn landscape sheets portrait and vice-versa.',
      features: [
        { title: 'Batch or Single Page Rotation', desc: 'Rotate all pages together or customize rotation angle per individual page.', icon: 'rotate-cw' },
        { title: 'Permanent Rotation Matrix', desc: 'Updates PDF view box coordinates permanently so all viewers display correctly.', icon: 'check-circle' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the PDF document with misaligned pages.' },
        { title: 'Choose Angle', description: 'Click rotate buttons (90° Left, 90° Right, 180°) or rotate specific pages.' },
        { title: 'Download Fixed PDF', description: 'Download your properly aligned document.' }
      ],
      faqs: [
        { question: 'Will the rotation stay when I open the file in Adobe Acrobat or Mac Preview?', answer: 'Yes, the page rotation metadata is permanently updated inside the PDF structure.' }
      ],
      relatedToolSlugs: ['organize-pdf', 'crop-pdf', 'edit-pdf', 'merge-pdf']
    },
    {
      id: 'add-page-numbers',
      slug: 'add-page-numbers',
      name: 'Add Page Numbers',
      shortDescription: 'Insert customizable page numbers, header/footer text, and page count labels.',
      category: 'edit',
      icon: 'hash',
      iconBg: 'rgba(236, 72, 153, 0.15)',
      accentColor: '#ec4899',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Add Page Numbers',
      seoTitle: 'Add Page Numbers to PDF Online Free – Number PDF Pages',
      metaDescription: 'Number PDF pages online with customizable positioning, formats ("Page 1 of N", "1"), start offsets, and font styles.',
      keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf pagination', 'insert page numbers pdf'],
      h1: 'Add Page Numbers & Headers to PDF',
      heroSubtitle: 'Number your document pages with custom positioning (top, bottom, left, center, right) and flexible styles.',
      longDescription: 'Add professional numbering to contracts, theses, manuals, and reports. Choose numbering formats like "1", "Page 1 of 20", or "Doc - 1", skip cover pages, and adjust margins.',
      features: [
        { title: '6 Position Placements', desc: 'Bottom-Center, Bottom-Right, Bottom-Left, Top-Center, Top-Right, Top-Left.', icon: 'grid' },
        { title: 'Custom Start Page & Offset', desc: 'Skip cover pages or table of contents by setting start page offsets.', icon: 'sliders' },
        { title: 'Font & Margin Controls', desc: 'Pick font family, font size, and edge padding to match document aesthetics.', icon: 'type' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the document you want to number.' },
        { title: 'Configure Style', description: 'Select position, format pattern, and font size.' },
        { title: 'Download Numbered PDF', description: 'Click "Add Page Numbers" to export.' }
      ],
      faqs: [
        { question: 'Can I start numbering from page 2 to skip my cover sheet?', answer: 'Yes! Set "Start at page" to 2, and the cover page will remain unnumbered.' }
      ],
      relatedToolSlugs: ['add-watermark', 'edit-pdf', 'organize-pdf', 'merge-pdf']
    },
    {
      id: 'add-watermark',
      slug: 'add-watermark',
      name: 'Add Watermark',
      shortDescription: 'Stamp text or image watermarks with custom opacity, rotation, and positioning.',
      category: 'edit',
      icon: 'droplet',
      iconBg: 'rgba(236, 72, 153, 0.15)',
      accentColor: '#ec4899',
      badge: 'Customizable',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Apply Watermark',
      seoTitle: 'Add Watermark to PDF Online Free – Text & Image Watermarks',
      metaDescription: 'Stamp custom text or logo image watermarks on PDF files online. Adjust opacity, 45-degree angle rotation, and layer positioning.',
      keywords: ['add watermark to pdf', 'watermark pdf online', 'stamp pdf', 'confidential watermark pdf'],
      h1: 'Add Text & Image Watermarks to PDF',
      heroSubtitle: 'Protect your intellectual property with customizable "CONFIDENTIAL", "DRAFT", or company logo watermarks.',
      longDescription: 'Stamp branded logos or prominent text watermarks (e.g. "CONFIDENTIAL", "SAMPLE", "DRAFT") across all pages. Fine-tune opacity, 45-degree slant, font color, and placement.',
      features: [
        { title: 'Text or Logo Watermarks', desc: 'Type custom text phrases or upload transparent PNG company logos.', icon: 'image' },
        { title: 'Opacity & Slant Controls', desc: 'Set translucent opacity (e.g. 20%) and angled slants so content stays readable underneath.', icon: 'sliders' },
        { title: 'Underlay or Overlay', desc: 'Place watermark beneath text layer or on top as an indelible stamp.', icon: 'layers' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select your PDF file.' },
        { title: 'Configure Watermark', description: 'Enter text (e.g. "CONFIDENTIAL"), adjust transparency and angle.' },
        { title: 'Apply & Download', description: 'Click "Apply Watermark" to download.' }
      ],
      faqs: [
        { question: 'Can the watermark be easily erased?', answer: 'Our engine rasterizes and stamps the watermark directly into the PDF content stream.' }
      ],
      relatedToolSlugs: ['add-page-numbers', 'protect-pdf', 'edit-pdf', 'sign-pdf']
    },
    {
      id: 'crop-pdf',
      slug: 'crop-pdf',
      name: 'Crop PDF',
      shortDescription: 'Trim margins or crop specific rectangular areas from PDF pages visually.',
      category: 'edit',
      icon: 'crop',
      iconBg: 'rgba(236, 72, 153, 0.15)',
      accentColor: '#ec4899',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Crop PDF',
      seoTitle: 'Crop PDF Online Free – Trim Margins & Crop PDF Pages',
      metaDescription: 'Crop PDF pages visually online for free. Drag a crop box over your document preview or set precise margin trims.',
      keywords: ['crop pdf', 'trim pdf margins', 'crop pdf online free', 'cut pdf borders'],
      h1: 'Crop PDF Pages & Trim Margins',
      heroSubtitle: 'Remove excessive white margins or focus on specific diagram regions with visual box cropping.',
      longDescription: 'Trim unwanted white space, remove printer marks, or isolate tables and diagrams by dragging a bounding box over the live preview.',
      features: [
        { title: 'Visual Bounding Box', desc: 'Drag handles across the page preview to define the exact crop zone.', icon: 'maximize' },
        { title: 'Apply to All or Single Page', desc: 'Uniformly trim all document pages or customize per specific page.', icon: 'layers' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the file you need to crop.' },
        { title: 'Adjust Crop Area', description: 'Drag the visual crop rectangle over the page preview.' },
        { title: 'Download Cropped PDF', description: 'Save the trimmed document.' }
      ],
      faqs: [
        { question: 'Does cropping delete the rest of the page data?', answer: 'Cropping updates the MediaBox and CropBox boundaries so viewers render only your specified region.' }
      ],
      relatedToolSlugs: ['rotate-pdf', 'edit-pdf', 'organize-pdf', 'pdf-to-jpg']
    },
    {
      id: 'edit-pdf',
      slug: 'edit-pdf',
      name: 'Edit PDF',
      shortDescription: 'Add text boxes, highlights, shapes, annotations, and images directly onto PDF pages.',
      category: 'edit',
      icon: 'edit-3',
      iconBg: 'rgba(236, 72, 153, 0.15)',
      accentColor: '#ec4899',
      badge: 'Canvas Editor',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Save Edited PDF',
      seoTitle: 'Edit PDF Online Free – Add Text, Shapes, Highlights & Annotations',
      metaDescription: 'Free online PDF editor. Add custom text boxes, freehand drawings, rectangle shapes, highlighter marks, and image stickers directly onto your PDF.',
      keywords: ['edit pdf', 'online pdf editor free', 'add text to pdf', 'annotate pdf online'],
      h1: 'Edit PDF Documents Online for Free',
      heroSubtitle: 'Add text annotations, highlight important clauses, draw shapes, and add comments with our browser canvas editor.',
      longDescription: 'Edit PDF files directly without installing complex desktop software. Type anywhere on the document, add colored highlight strips, draw arrows and rectangles, or whiteout outdated text.',
      features: [
        { title: 'Interactive Text Annotations', desc: 'Click to type anywhere on the page with customizable font sizes and colors.', icon: 'type' },
        { title: 'Highlighter & Freehand Pen', desc: 'Highlight key paragraphs or sketch freehand annotations with smooth ink strokes.', icon: 'feather' },
        { title: 'Shapes & Whiteout', desc: 'Place boxes, arrows, circles, or solid whiteout rectangles over sensitive text.', icon: 'square' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Open the document in the interactive canvas editor.' },
        { title: 'Annotate & Add Text', description: 'Use the toolbar to add text, highlights, shapes, or stickers.' },
        { title: 'Download', description: 'Click "Save Edited PDF" to export the updated document.' }
      ],
      faqs: [
        { question: 'Can I add multiple annotations across several pages?', answer: 'Yes, browse through pages using the thumbnail drawer and add edits on any page.' }
      ],
      relatedToolSlugs: ['sign-pdf', 'pdf-forms', 'redact-pdf', 'add-watermark']
    },
    {
      id: 'pdf-forms',
      slug: 'pdf-forms',
      name: 'PDF Forms',
      shortDescription: 'Fill out interactive form fields, checkboxes, radio buttons, and export filled forms.',
      category: 'edit',
      icon: 'check-square',
      iconBg: 'rgba(236, 72, 153, 0.15)',
      accentColor: '#ec4899',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Save Completed Form',
      seoTitle: 'Fill PDF Forms Online Free – Interactive Form Filler',
      metaDescription: 'Fill out PDF form fields, text inputs, checkboxes, and dropdowns directly in your web browser without Adobe Acrobat.',
      keywords: ['fill pdf forms', 'pdf form filler', 'interactive pdf forms', 'complete pdf forms online'],
      h1: 'Fill Out PDF Form Fields Online',
      heroSubtitle: 'Complete government applications, tax forms, and job surveys directly in your browser.',
      longDescription: 'No need to print, manually pen, and re-scan forms. Our AcroForm inspector detects interactive input fields, checkboxes, and radio buttons so you can fill and save electronically.',
      features: [
        { title: 'AcroForm Auto-Detection', desc: 'Instantly recognizes standard fillable form widgets embedded in documents.', icon: 'zap' },
        { title: 'Flattening or Dynamic Form', desc: 'Optionally flatten fields to prevent subsequent modifications after submission.', icon: 'lock' }
      ],
      steps: [
        { title: 'Upload Form PDF', description: 'Select your interactive PDF form.' },
        { title: 'Fill In Fields', description: 'Type in form boxes, check checkboxes, and select dropdown items.' },
        { title: 'Save & Download', description: 'Download your completed, perfectly formatted form.' }
      ],
      faqs: [
        { question: 'Can I flatten the form so values cannot be changed?', answer: 'Yes! Toggle the "Flatten Form" option before downloading.' }
      ],
      relatedToolSlugs: ['sign-pdf', 'edit-pdf', 'protect-pdf', 'pdf-to-word']
    },

    // 6. PDF SECURITY
    {
      id: 'unlock-pdf',
      slug: 'unlock-pdf',
      name: 'Unlock PDF',
      shortDescription: 'Remove PDF passwords and unlock editing, printing, and copying permissions.',
      category: 'security',
      icon: 'unlock',
      iconBg: 'rgba(239, 68, 68, 0.15)',
      accentColor: '#ef4444',
      badge: 'Fast',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Unlock PDF',
      seoTitle: 'Unlock PDF Online Free – Remove PDF Password Security',
      metaDescription: 'Remove password restrictions from protected PDF files online. Unlock editing, copying, and printing permissions permanently.',
      keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'pdf password remover online'],
      h1: 'Remove Password & Restrictions from PDF',
      heroSubtitle: 'Decouple passwords and remove restrictive viewing or printing permissions with authorized decryption.',
      longDescription: 'If you have legitimate access to a password-protected PDF and want to remove the password permanently, our tool decrypts the document and exports an unencrypted version.',
      features: [
        { title: 'Removes All Permission Locks', desc: 'Restores full rights to print, edit, extract text, and sign.', icon: 'check-circle' },
        { title: 'Zero Cloud Storage', desc: 'Decryption keys and documents remain strictly isolated in your browser memory.', icon: 'shield-check' }
      ],
      steps: [
        { title: 'Upload Protected PDF', description: 'Select your password-protected PDF document.' },
        { title: 'Enter Password', description: 'Provide the authorized password to decrypt the file.' },
        { title: 'Download Unlocked PDF', description: 'Download the permanently unlocked, password-free document.' }
      ],
      faqs: [
        { question: 'Do I need to know the password to unlock it?', answer: 'For strongly encrypted user-locked PDFs, you must enter the password once to authorize removal.' }
      ],
      relatedToolSlugs: ['protect-pdf', 'sign-pdf', 'redact-pdf', 'merge-pdf']
    },
    {
      id: 'protect-pdf',
      slug: 'protect-pdf',
      name: 'Protect PDF',
      shortDescription: 'Encrypt PDF files with robust AES passwords and restrict editing or printing.',
      category: 'security',
      icon: 'lock',
      iconBg: 'rgba(239, 68, 68, 0.15)',
      accentColor: '#ef4444',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Encrypt & Protect PDF',
      seoTitle: 'Protect PDF Online Free – Password Protect PDF File',
      metaDescription: 'Encrypt PDF documents with strong AES passwords online. Prevent unauthorized viewing, printing, text copying, and modifications.',
      keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf online', 'pdf security password'],
      h1: 'Password Protect & Encrypt PDF Files',
      heroSubtitle: 'Secure confidential financial statements, medical files, and contracts with AES encryption.',
      longDescription: 'Add industry-standard AES encryption to your sensitive PDF files. Require a secret password to open the file, and toggle permission restrictions against printing or copying.',
      features: [
        { title: 'Strong AES Encryption', desc: 'Standard encryption ensuring unreadable data without the correct password.', icon: 'shield' },
        { title: 'Granular Permissions', desc: 'Optionally disable text copying, printing, or form modification.', icon: 'sliders' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the document you wish to encrypt.' },
        { title: 'Set Password', description: 'Enter a strong secret password and choose permission flags.' },
        { title: 'Download Protected PDF', description: 'Save your encrypted, protected PDF.' }
      ],
      faqs: [
        { question: 'Can anyone open the file without the password?', answer: 'No. The file is cryptographically encrypted; without the password, the document cannot be opened in any viewer.' }
      ],
      relatedToolSlugs: ['unlock-pdf', 'sign-pdf', 'redact-pdf', 'pdf-to-pdfa']
    },
    {
      id: 'sign-pdf',
      slug: 'sign-pdf',
      name: 'Sign PDF',
      shortDescription: 'Draw, type, or upload digital signatures and place them anywhere on your document.',
      category: 'security',
      icon: 'pen-tool',
      iconBg: 'rgba(239, 68, 68, 0.15)',
      accentColor: '#ef4444',
      badge: 'Popular',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Sign Document & Download',
      seoTitle: 'Sign PDF Online Free – Electronic Signature & Draw Signature',
      metaDescription: 'Sign PDF documents online for free. Draw your signature, type a stylized script name, or upload signature image and place on any page.',
      keywords: ['sign pdf', 'e-sign pdf free', 'draw signature pdf', 'electronic signature online'],
      h1: 'Sign PDF Documents Electronically',
      heroSubtitle: 'Draw with your mouse or finger, type a stylized script signature, or stamp your signature image.',
      longDescription: 'Sign contracts, NDAs, leases, and agreements in seconds. Draw your signature on touchscreen or trackpad, pick from elegant typography styles, or upload a photo of your handwritten signature.',
      features: [
        { title: '3 Ways to Sign', desc: 'Draw freehand with ink smoothing, type stylized script, or upload a PNG signature image.', icon: 'edit' },
        { title: 'Drag & Resize on Live Page', desc: 'Position and scale signature stamps precisely where signature lines appear.', icon: 'move' },
        { title: 'Multi-Page & Date Stamps', desc: 'Add signing date badges and initials across multiple pages.', icon: 'calendar' }
      ],
      steps: [
        { title: 'Upload Contract', description: 'Select the PDF document that needs a signature.' },
        { title: 'Create Signature', description: 'Draw, type, or upload your signature.' },
        { title: 'Place & Download', description: 'Drag the signature box onto the designated page line and export.' }
      ],
      faqs: [
        { question: 'Is my digital signature legally valid?', answer: 'Yes, electronic signatures created with user intent are legally recognized under ESIGN and eIDAS acts for standard agreements.' }
      ],
      relatedToolSlugs: ['protect-pdf', 'pdf-forms', 'redact-pdf', 'edit-pdf']
    },
    {
      id: 'redact-pdf',
      slug: 'redact-pdf',
      name: 'Redact PDF',
      shortDescription: 'Permanently black out and scrub sensitive text, SSNs, credit cards, and confidential data.',
      category: 'security',
      icon: 'eye-off',
      iconBg: 'rgba(239, 68, 68, 0.15)',
      accentColor: '#ef4444',
      badge: 'True Redaction',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Apply Permanent Redaction',
      seoTitle: 'Redact PDF Online Free – Permanently Black Out Sensitive Text',
      metaDescription: 'Permanently redact sensitive text, PII, SSNs, and data from PDF documents online. Scrubs underlying text streams completely.',
      keywords: ['redact pdf', 'black out text pdf', 'remove sensitive info pdf', 'true pdf redaction free'],
      h1: 'Permanently Redact Sensitive Info From PDF',
      heroSubtitle: 'Black out sensitive text and permanently delete underlying character streams so data cannot be highlighted or recovered.',
      longDescription: 'Unlike simple black rectangle overlays where text remains copyable underneath, our true redaction engine deletes the underlying vector text streams and stamps opaque black bounding blocks.',
      features: [
        { title: 'True Stream Sanitization', desc: 'Scrubs text streams permanently so data cannot be highlighted or extracted via copy-paste.', icon: 'shield-check' },
        { title: 'Visual Selection Box', desc: 'Drag boxes over bank details, names, addresses, or sensitive clauses.', icon: 'square' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Select the file containing confidential information.' },
        { title: 'Mark Redaction Zones', description: 'Draw black-out rectangles over sensitive sections.' },
        { title: 'Sanitize & Download', description: 'Click "Apply Permanent Redaction" to scrub and export.' }
      ],
      faqs: [
        { question: 'Can someone copy the text underneath the black box?', answer: 'No! Our engine performs true stream sanitization, completely removing the text data from the file structure.' }
      ],
      relatedToolSlugs: ['protect-pdf', 'unlock-pdf', 'sign-pdf', 'edit-pdf']
    },
    {
      id: 'compare-pdf',
      slug: 'compare-pdf',
      name: 'Compare PDF',
      shortDescription: 'Automated AI-powered side-by-side visual diff and field-by-field difference inspection.',
      category: 'security',
      icon: 'git-pull-request',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      accentColor: '#6366f1',
      badge: 'AI Diff Engine',
      popular: true,
      acceptsMultipleFiles: true,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Compare Documents Now',
      seoTitle: 'Compare PDF Files Online Free – AI PDF Diff Checker',
      metaDescription: 'Compare two or more PDF files online free. Instant side-by-side visual redline diffs, field-by-field change detection for contracts and invoices.',
      keywords: ['compare pdf', 'pdf diff checker', 'compare two pdf files', 'pdf redline comparison online'],
      h1: 'AI-Powered PDF Diff & Comparison Engine',
      heroSubtitle: 'Instantly find differences between two PDF versions — field by field, clause by clause with side-by-side visual redlines.',
      longDescription: 'Stop wasting hours manually checking contracts or invoices line by line. Our AI diff engine parses text coordinates, compares revisions, and generates interactive redline reports in seconds.',
      features: [
        { title: 'Side-by-Side Visual Diff', desc: 'Synchronized dual-pane document viewer highlighting added, removed, and modified text.', icon: 'columns' },
        { title: 'Field-by-Field Discrepancy Table', desc: 'Structured summary table categorizing exact value changes with confidence scores.', icon: 'table' },
        { title: 'Multi-Format Reports', desc: 'Export comparison audits as Interactive Table, JSON diff, Executive Summary, or Redlines.', icon: 'file-text' }
      ],
      steps: [
        { title: 'Upload Original & Revised PDFs', description: 'Drop your two PDF files into the comparison dropzones.' },
        { title: 'Run Comparison', description: 'Click "Compare Documents" to parse layouts and calculate diffs.' },
        { title: 'Inspect Redlines & Export', description: 'Review changes in the side-by-side inspector or export audit reports.' }
      ],
      faqs: [
        { question: 'What types of documents can I compare?', answer: 'You can compare contracts, legal agreements, vendor invoices, price quotes, technical specifications, and resumes.' },
        { question: 'Is my confidential data kept private?', answer: 'Yes! PDF extraction and diff parsing execute 100% locally inside your web browser.' }
      ],
      relatedToolSlugs: ['merge-pdf', 'pdf-to-word', 'ai-summarizer', 'pdf-to-markdown']
    },

    // 7. PDF INTELLIGENCE (AI-POWERED)
    {
      id: 'ai-summarizer',
      slug: 'ai-summarizer',
      name: 'AI PDF Summarizer',
      shortDescription: 'Generate executive summaries, key bullet points, and action items in seconds.',
      category: 'intelligence',
      icon: 'cpu',
      iconBg: 'rgba(139, 92, 246, 0.15)',
      accentColor: '#8b5cf6',
      badge: 'AI Powered',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf', '.txt'],
      ctaText: 'Summarize PDF Document',
      seoTitle: 'AI PDF Summarizer Online Free – Summarize PDF Documents',
      metaDescription: 'Summarize long PDF research papers, reports, and contracts using AI. Get key takeaways, executive briefs, and bullet points instantly.',
      keywords: ['ai pdf summarizer', 'summarize pdf online', 'pdf summary ai', 'extract key points pdf'],
      h1: 'AI-Powered PDF Document Summarizer',
      heroSubtitle: 'Condense 50-page reports, research papers, and legal agreements into actionable bullet points in seconds.',
      longDescription: 'Extract the essence of complex documents instantly. Our AI summarizer analyzes document structure, highlights core findings, and generates structured executive briefs with adjustable length.',
      features: [
        { title: 'Executive Takeaways', desc: 'Extracts high-level overviews, decision points, and critical dates.', icon: 'zap' },
        { title: 'Adjustable Detail Levels', desc: 'Choose Quick TL;DR, Comprehensive Brief, or Bullet Point Action Items.', icon: 'sliders' },
        { title: 'Copy & Export Ready', desc: 'One-click copy to clipboard or export as structured Markdown/PDF.', icon: 'copy' }
      ],
      steps: [
        { title: 'Upload PDF Document', description: 'Select the report, paper, or contract.' },
        { title: 'Select Summary Length', description: 'Choose between Short TL;DR, Standard, or Detailed Analysis.' },
        { title: 'View & Copy Summary', description: 'Review the generated summary, copy to clipboard, or export.' }
      ],
      faqs: [
        { question: 'Can it summarize academic research papers with complex terminology?', answer: 'Yes, it accurately parses abstract sections, methodology findings, and conclusions.' }
      ],
      relatedToolSlugs: ['pdf-to-markdown', 'translate-pdf', 'compare-pdf', 'ocr-pdf']
    },
    {
      id: 'translate-pdf',
      slug: 'translate-pdf',
      name: 'Translate PDF',
      shortDescription: 'Translate PDF content into 30+ languages while preserving layout and structure.',
      category: 'intelligence',
      icon: 'globe',
      iconBg: 'rgba(139, 92, 246, 0.15)',
      accentColor: '#8b5cf6',
      badge: '30+ Languages',
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf', '.txt'],
      ctaText: 'Translate Document',
      seoTitle: 'Translate PDF Online Free – Multilingual PDF Document Translator',
      metaDescription: 'Translate PDF documents into Spanish, French, German, Chinese, Japanese, and 30+ languages online with layout preservation.',
      keywords: ['translate pdf', 'pdf document translator', 'translate pdf to english', 'free pdf translator online'],
      h1: 'Translate PDF Documents Online',
      heroSubtitle: 'Break language barriers. Translate full PDF documents into 30+ languages while preserving formatting.',
      longDescription: 'Translate user manuals, international contracts, brochures, and research reports into Spanish, French, German, Arabic, Chinese, Japanese, and more.',
      features: [
        { title: '30+ Target Languages', desc: 'Supports all major European, Asian, and Middle Eastern languages.', icon: 'globe' },
        { title: 'Preserves Layout Flow', desc: 'Translates text in-place without breaking table structures or headers.', icon: 'layout' }
      ],
      steps: [
        { title: 'Upload Document', description: 'Select the PDF in the original language.' },
        { title: 'Choose Target Language', description: 'Select the desired translation language.' },
        { title: 'Download Translated PDF', description: 'Save the translated, cleanly formatted document.' }
      ],
      faqs: [
        { question: 'What languages are supported?', answer: 'We support over 30 languages including Spanish, French, German, Portuguese, Italian, Japanese, Chinese, Russian, Hindi, and Arabic.' }
      ],
      relatedToolSlugs: ['ai-summarizer', 'pdf-to-markdown', 'ocr-pdf', 'pdf-to-word']
    },
    {
      id: 'pdf-to-markdown',
      slug: 'pdf-to-markdown',
      name: 'PDF to Markdown',
      shortDescription: 'Extract clean GitHub-flavored markdown with headers, lists, and tables for LLMs & Notion.',
      category: 'intelligence',
      icon: 'file-text',
      iconBg: 'rgba(139, 92, 246, 0.15)',
      accentColor: '#8b5cf6',
      badge: 'For LLMs & Notion',
      popular: true,
      acceptsMultipleFiles: false,
      acceptedFileTypes: ['.pdf'],
      ctaText: 'Convert PDF to Markdown',
      seoTitle: 'PDF to Markdown Converter Online Free – PDF to MD for LLMs & Notion',
      metaDescription: 'Convert PDF documents into clean, structured Markdown (.md) online. Extracts headers, bullet points, tables, and code blocks for Obsidian, Notion, and AI LLMs.',
      keywords: ['pdf to markdown', 'pdf to md', 'convert pdf to markdown online', 'pdf for llm markdown'],
      h1: 'Convert PDF to Structured Markdown (.md)',
      heroSubtitle: 'Extract clean Markdown formatting for feeding LLM prompts, Notion pages, Obsidian vaults, and developer documentation.',
      longDescription: 'Standard PDF text copy-pasting yields broken line breaks and garbled tables. Our PDF to Markdown converter reconstructs proper `#` headers, `-` bullet lists, table pipes `|---|`, and code fences.',
      features: [
        { title: 'Clean GitHub Flavored Markdown', desc: 'Outputs standardized GFM syntax compatible with any markdown parser.', icon: 'code' },
        { title: 'Optimized for LLM Prompts', desc: 'Eliminates redundant whitespaces and formatting noise to maximize AI context token efficiency.', icon: 'cpu' },
        { title: 'One-Click Copy or .md Download', desc: 'Copy directly to clipboard or download as a standalone .md document.', icon: 'copy' }
      ],
      steps: [
        { title: 'Upload PDF', description: 'Choose your document.' },
        { title: 'Extract Markdown', description: 'Our parser analyzes typography hierarchy and tables.' },
        { title: 'Copy or Download .MD', description: 'Copy text to clipboard or download the .md file.' }
      ],
      faqs: [
        { question: 'Does it format tables as markdown tables?', answer: 'Yes! Tables are formatted using markdown pipes `| Header 1 | Header 2 |` for clean rendering in Notion, GitHub, and LLMs.' }
      ],
      relatedToolSlugs: ['ai-summarizer', 'pdf-to-word', 'ocr-pdf', 'compare-pdf']
    }
  ];

  public getCategories(): CategoryInfo[] {
    return this.categories;
  }

  public getCategoryById(id: ToolCategory): CategoryInfo | undefined {
    return this.categories.find(c => c.id === id);
  }

  public getCategoryBySlug(slug: string): CategoryInfo | undefined {
    return this.categories.find(c => c.slug === slug || c.id === slug);
  }

  public getAllTools(): ToolDefinition[] {
    return this.tools;
  }

  public getToolBySlug(slug: string): ToolDefinition | undefined {
    return this.tools.find(t => t.slug === slug || t.id === slug);
  }

  public getToolsByCategory(category: ToolCategory): ToolDefinition[] {
    return this.tools.filter(t => t.category === category);
  }

  public getPopularTools(): ToolDefinition[] {
    return this.tools.filter(t => t.popular);
  }

  public getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
    return tool.relatedToolSlugs
      .map(slug => this.getToolBySlug(slug))
      .filter((t): t is ToolDefinition => !!t);
  }

  public searchTools(query: string): ToolDefinition[] {
    if (!query || query.trim() === '') {
      return this.tools;
    }
    const q = query.toLowerCase().trim();
    return this.tools.filter(t => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  }
}
