export type PlanType = 'free' | 'pro';

export type OutputFormat = 'table' | 'json' | 'summary' | 'highlight';

export type DiffStatus = 'unchanged' | 'value_changed' | 'added' | 'removed' | 'label_variation';

export interface PdfDocument {
  id: string;
  fileName: string;
  fileSize?: string;
  pageCount?: number;
  content: string;
  thumbnail?: string; // canvas preview image data URL
  file?: File;
  isCustomText?: boolean;
}

export interface DiffItem {
  fieldName: string;
  status: DiffStatus;
  valueInFile1?: string;
  valueInFile2?: string;
  file1: string;
  file2: string;
  label1?: string;
  label2?: string;
  changeSummary?: string;
  excerptBefore?: string;
  excerptAfter?: string;
}

export interface CompareSummary {
  totalFieldsCompared: number;
  unchanged: number;
  valueChanged: number;
  added: number;
  removed: number;
  labelVariations?: number;
}

export interface CompareResponse {
  summary: CompareSummary;
  differences: DiffItem[];
  renderedOutput: string;
  extractionWarning?: string;
  error?: string;
  message?: string;
  maxFilesAllowed?: number;
}

export interface CompareRequest {
  plan: PlanType;
  outputFormat: OutputFormat;
  documents: {
    fileName: string;
    content: string;
  }[];
}

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  documents: {
    fileName: string;
    content: string;
  }[];
}
