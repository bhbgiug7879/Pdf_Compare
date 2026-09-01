export type ToolCategory =
  | 'organize'
  | 'optimize'
  | 'convert-to'
  | 'convert-from'
  | 'edit'
  | 'security'
  | 'intelligence';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
}

export interface HowToStep {
  title: string;
  description: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  icon: string;
  iconBg: string;
  accentColor: string;
  badge?: string;
  popular?: boolean;
  acceptsMultipleFiles?: boolean;
  acceptedFileTypes: string[]; // e.g. ['.pdf'], ['.jpg', '.png'], ['.docx'], etc.
  ctaText: string;
  
  // SEO & Content
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  heroSubtitle: string;
  longDescription: string;
  features: { title: string; desc: string; icon: string }[];
  steps: HowToStep[];
  faqs: ToolFaq[];
  relatedToolSlugs: string[];
}

export interface ProcessedResult {
  success: boolean;
  fileName: string;
  downloadUrl?: string;
  blob?: Blob;
  originalSize?: number;
  newSize?: number;
  message?: string;
  textOutput?: string;
  images?: string[]; // for PDF to JPG
  summaryBullets?: string[];
  metadata?: Record<string, any>;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  previewUrl?: string;
  rotation?: number; // 0, 90, 180, 270
  selected?: boolean;
  dataArrayBuffer?: ArrayBuffer;
}

export interface PageThumbnailItem {
  pageNumber: number; // 1-based
  originalIndex: number; // 0-based
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
  previewUrl?: string;
  fileIndex?: number; // for multi-file merge/organize
}
