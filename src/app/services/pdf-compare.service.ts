import { Injectable } from '@angular/core';
import {
  CompareRequest,
  CompareResponse,
  DiffItem,
  DiffStatus,
  CompareSummary,
  OutputFormat,
  PlanType,
  SamplePreset
} from '../models/compare.model';

@Injectable({
  providedIn: 'root'
})
export class PdfCompareService {
  public readonly SYSTEM_PROMPT = `You are "PDF Compare AI", a document comparison engine embedded in a web app.

## YOUR JOB
You receive the extracted content of two or more PDF documents (as text, key-value
pairs, or OCR output). Compare them field by field and report differences with
complete accuracy. Never guess or hallucinate a value that isn't present in the
source text.

## INPUT FORMAT
You will receive a JSON object like this:

{
  "plan": "free" | "pro",
  "outputFormat": "table" | "json" | "summary" | "highlight",
  "documents": [
    { "fileName": "invoice_v1.pdf", "content": "<extracted text or key:value pairs>" },
    { "fileName": "invoice_v2.pdf", "content": "<extracted text or key:value pairs>" }
  ]
}

## PLAN RULES (enforce strictly)
- If "plan" is "free": only the FIRST TWO documents in the "documents" array may be
  compared. If more than 2 documents are provided on the free plan, respond with:
  {
    "error": "PLAN_LIMIT_EXCEEDED",
    "message": "Free plan supports comparing 2 files only. Upgrade to Pro to compare more files.",
    "maxFilesAllowed": 2
  }
  and stop — do not attempt any comparison.
- If "plan" is "pro": compare all documents provided (2 or more), pairwise and/or
  as a combined multi-file diff, as requested.

## COMPARISON LOGIC
1. Parse both documents into a normalized set of fields (key/label → value).
   - Match fields primarily by field name/label (case-insensitive, trim whitespace,
     ignore punctuation differences like ":" vs "-").
   - If a field name has minor variations (e.g. "Invoice No." vs "Invoice Number"),
     treat them as the SAME field if they clearly refer to the same concept, and
     note the label variation separately from the value difference.
2. Classify every field into one of these categories:
   - "unchanged"      → same field name, same value in both documents
   - "value_changed"  → same field name, different value
   - "added"          → field exists only in the second (or newer) document
   - "removed"        → field exists only in the first document, missing in the second
   - "label_variation"→ field name differs slightly but refers to the same data point
                         (report both label variants)
3. For text-heavy sections (paragraphs, terms, clauses) that aren't simple key-value
   fields, do a semantic diff and summarize what changed in plain language, plus a
   short excerpt of the before/after text (max ~200 characters each) — do not dump
   entire paragraphs.
4. Preserve exact original values (numbers, dates, currency, IDs) — never reformat
   or "correct" a value when reporting it; only reformat for the FINAL display per
   outputFormat below.
5. If documents appear to be completely different document types (e.g. an invoice
   vs a resume), say so plainly instead of forcing a field-by-field comparison.

## OUTPUT FORMATS
Always return valid JSON with this shape, then additionally shape "renderedOutput"
based on "outputFormat":

{
  "summary": {
    "totalFieldsCompared": <number>,
    "unchanged": <number>,
    "valueChanged": <number>,
    "added": <number>,
    "removed": <number>
  },
  "differences": [
    {
      "fieldName": "Invoice Number",
      "status": "value_changed",
      "valueInFile1": "INV-1001",
      "valueInFile2": "INV-1002",
      "file1": "invoice_v1.pdf",
      "file2": "invoice_v2.pdf"
    }
  ],
  "renderedOutput": "<string, shaped per outputFormat>"
}
`;

  // Built-in Sample Presets for instantaneous test drive
  public readonly SAMPLE_PRESETS: SamplePreset[] = [
    {
      id: 'payslips',
      title: 'KPN Fresh Payslip (July vs May 2026)',
      category: 'Payroll & HR',
      description: 'Employee payslip comparison: Month change, Taxable Income revisions, and YTD Earning for Tax with Perks.',
      documents: [
        {
          fileName: 'payslip-2026-2027-7-1019942-KPNFRESH (July).pdf',
          content: `KPN FARM FRESH
No.11/A-12, 14th Main Road, 4th Cross Rd, Sector 5, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102
Payslip For The Month Of: July 2026
Employee Code: 1019942  Employee name: Logesh S
Date of Joining: 06 Aug 2025  Bank Name: Bank of India
Department: Marketing  Bank Account Number: 8058101100009733
Designation: Team Leader  PF Account Number: TNAMB10262330000028723
Work Location: Regional Office Chennai  UAN No: 101328842354
Esic Account Number: -  LWP: 0
Days Worked: 31  Arrears Days: 0
Basic Salary: 21,100.00  Profession Tax: 208.00
House Rent Allowance: 4,900.00  Provident Fund: 1,800.00
Leave Encashment: 812.00  Parental Insurance Deduction: 468.00
Total Earnings: 32,812.00  Total Deductions: 2,476.00
In words ( ₹ ) : Thirty-two thousand eight hundred and twelve Only
Net Salary : 30,336.00
BALANCE TAX: 0.00  CURRENT MONTH TDS: 0.00
TAX ALREADY DEDUCTED: 0.00  HRA RECEIVED: 0.00
TOTAL INCOME TAX: 0.00  RENT PAID: 0.00
TAXABLE INCOME: 240,250.00  RENT PAID LESS BASIC: 0.00
PF,VPF, PREV. EMPLOYER PF And PREV. EMPLOYER VPF: 0.00  BASIC 4050: 0.00
DEDUCTION U/S 80C: 0.00  HRA EXEMPTIONS(MIN.): 0.00
DEDUCTION U/S VIA: 0.00
DEDUCTION U/S 24 (INT HSG): 0.00
EXEMPTION U/S 16 (PT): 0.00
TOTAL EXEMPTION U/S 10: 0.00
EARNING FOR TAX WITH PERKS: 315,248.00`
        },
        {
          fileName: 'payslip-2026-2027-5-1019942-KPNFRESH (May).pdf',
          content: `KPN FARM FRESH
No.11/A-12, 14th Main Road, 4th Cross Rd, Sector 5, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102
Payslip For The Month Of: May 2026
Employee Code: 1019942  Employee name: Logesh S
Date of Joining: 06 Aug 2025  Bank Name: Bank of India
Department: Marketing  Bank Account Number: 8058101100009733
Designation: Team Leader  PF Account Number: TNAMB10262330000028723
Work Location: Regional Office Chennai  UAN No: 101328842354
Esic Account Number: -  LWP: 0
Days Worked: 31  Arrears Days: 0
Basic Salary: 21,100.00  Profession Tax: 208.00
House Rent Allowance: 4,900.00  Provident Fund: 1,800.00
Leave Encashment: 812.00  Parental Insurance Deduction: 468.00
Total Earnings: 32,812.00  Total Deductions: 2,476.00
In words ( ₹ ) : Thirty-two thousand eight hundred and twelve Only
Net Salary : 30,336.00
EARNING FOR TAX WITH PERKS: 313,624.00  CURRENT MONTH TDS: 0.00
TOTAL EXEMPTION U/S 10: 0.00  HRA RECEIVED: 0.00
EXEMPTION U/S 16 (PT): 0.00  RENT PAID: 0.00
DEDUCTION U/S 24 (INT HSG): 0.00  RENT PAID LESS BASIC: 0.00
DEDUCTION U/S VIA: 0.00  BASIC 4050: 0.00
DEDUCTION U/S 80C: 0.00  HRA EXEMPTIONS(MIN.): 0.00
PF,VPF, PREV. EMPLOYER PF And PREV. EMPLOYER VPF: 0.00
TAXABLE INCOME: 238,630.00
TOTAL INCOME TAX: 0.00
TAX ALREADY DEDUCTED: 0.00
BALANCE TAX: 0.00`
        }
      ]
    },
    {
      id: 'invoices',
      title: 'Invoice V1 vs Invoice V2',
      category: 'Invoicing & Accounting',
      description: 'Standard invoice revision with updated unit pricing, due date extension, and added surcharge fee.',
      documents: [
        {
          fileName: 'invoice_v1.pdf',
          content: `INVOICE
Invoice Number: INV-2026-089
Vendor: Apex Cloud Solutions LLC
Client: Horizon Digital Inc.
Invoice Date: 2026-08-01
Due Date: 2026-08-15
Payment Terms: Net 15
Item 1: Enterprise Cloud Hosting (12 mo) - $12,000.00
Item 2: Dedicated Support Tier 2 - $2,400.00
Subtotal: $14,400.00
Tax Rate: 8.5%
Tax Amount: $1,224.00
Total Due: $15,624.00
Payment Method: Wire Transfer (ACH 4492-9901)
Notes: Standard SLA of 99.9% uptime applies. Late payments accrue 1.5% interest per month.`
        },
        {
          fileName: 'invoice_v2.pdf',
          content: `INVOICE
Invoice No.: INV-2026-089-REV2
Vendor: Apex Cloud Solutions LLC
Client: Horizon Digital Inc.
Invoice Date: 2026-08-01
Due Date: 2026-08-30
Payment Terms: Net 30
Item 1: Enterprise Cloud Hosting (12 mo) - $13,500.00
Item 2: Dedicated Support Tier 2 - $2,400.00
Item 3: SSL Wildcard Certificate - $450.00
Subtotal: $16,350.00
Tax Rate: 8.5%
Tax Amount: $1,389.75
Total Amount Due: $17,739.75
Payment Method: Wire Transfer (ACH 4492-9901)
Notes: Premium SLA of 99.99% uptime applies. Late payments accrue 1.0% interest per month with 5 days grace period.`
        }
      ]
    },
    {
      id: 'contracts',
      title: 'Enterprise Master Services Agreement',
      category: 'Legal & Procurement',
      description: 'SaaS redline draft comparison: liability caps, governing law changes, and auto-renewal term modifications.',
      documents: [
        {
          fileName: 'MSA_Acme_Draft1.pdf',
          content: `MASTER SERVICES AGREEMENT (DRAFT v1.0)
Contract ID: AGR-2026-992
Effective Date: October 1, 2026
Party A (Provider): CloudMatrix Technologies Inc.
Party B (Customer): Global Logistics Corp.
Initial Term: 24 months
Renewal Notice Period: 60 days prior to expiration
Annual Subscription Fee: $120,000.00 USD
Payment Schedule: Annually in advance
Limitation of Liability: Capped at 1x total annual fees paid in preceding 12 months.
Indemnification: Provider shall defend Customer against third-party IP infringement claims up to $500,000 max.
Governing Law: State of Delaware, USA
Confidentiality Term: 3 years following termination.`
        },
        {
          fileName: 'MSA_Acme_Draft2_Redline.pdf',
          content: `MASTER SERVICES AGREEMENT (DRAFT v2.1)
Contract ID: AGR-2026-992
Effective Date: October 15, 2026
Party A (Provider): CloudMatrix Technologies Inc.
Party B (Customer): Global Logistics Corp.
Initial Term: 36 months
Renewal Notice Period: 30 days prior to expiration
Annual Subscription Fee: $108,000.00 USD
Payment Schedule: Quarterly in advance ($27,000 per quarter)
Limitation of Liability: Capped at 2x total annual fees paid in preceding 12 months with uncapped liability for gross negligence.
Indemnification: Provider shall defend Customer against third-party IP infringement claims uncapped.
Governing Law: State of New York, USA
Confidentiality Term: 5 years following termination.
Data Residency: All customer data must remain strictly in US-East regions.`
        }
      ]
    },
    {
      id: 'offers',
      title: 'Employment Offer Letter & Counter',
      category: 'Human Resources & Talent',
      description: 'Executive hiring package review: Base compensation, equity grant units, signing bonus, and remote stipend.',
      documents: [
        {
          fileName: 'Offer_Letter_Initial.pdf',
          content: `CONFIDENTIAL EMPLOYMENT OFFER
Candidate: Sarah Jenkins
Position: Staff Software Architect
Department: Distributed Systems Engineering
Start Date: November 1, 2026
Reporting To: VP of Engineering
Base Salary: $210,000 per annum
Signing Bonus: $25,000 subject to 12-month clawback
Equity Incentive: 15,000 Stock Options (4-year vest, 1-year cliff)
Annual Performance Bonus Target: 15%
Vacation / PTO: 20 days per calendar year
Remote Work Stipend: $1,000 one-time hardware allowance`
        },
        {
          fileName: 'Offer_Letter_Revised.pdf',
          content: `CONFIDENTIAL EMPLOYMENT OFFER (REVISED)
Candidate: Sarah Jenkins
Position: Staff Software Architect
Department: Distributed Systems Engineering
Start Date: November 15, 2026
Reporting To: VP of Engineering
Base Salary: $230,000 per annum
Signing Bonus: $40,000 subject to 12-month clawback
Equity Grant: 22,500 Restricted Stock Units (RSUs) (4-year vest, 1-year cliff)
Annual Performance Bonus Target: 20%
Vacation / PTO: Unlimited Flexible PTO
Remote Work Stipend: $2,500 one-time setup allowance + $150 monthly wellness reimbursement`
        }
      ]
    },
    {
      id: 'pro_multi',
      title: 'Multi-Vendor SaaS Bid Comparison (Pro 3-Way)',
      category: 'Pro Tier Multi-File Diff',
      description: '3-way comparison between Vendor Alpha, Vendor Beta, and Vendor Gamma RFP bids.',
      documents: [
        {
          fileName: 'vendor_alpha_proposal.pdf',
          content: `PROPOSAL: Cloud Database Migration
Vendor: Alpha Cloudworks
Total Bid Price: $78,500.00
Implementation Timeline: 8 weeks
Support Level: 24/7 Phone & Slack
SLA Guarantee: 99.95%
Dedicated Project Manager: Yes
Data Migration Tooling: Proprietary AlphaMigrate
Post-Go-Live Support: 30 days included`
        },
        {
          fileName: 'vendor_beta_proposal.pdf',
          content: `PROPOSAL: Cloud Database Migration
Vendor: Beta Data Systems
Total Bid Price: $64,000.00
Implementation Timeline: 12 weeks
Support Level: 8x5 Email only
SLA Guarantee: 99.9%
Dedicated Project Manager: No (Shared Resource)
Data Migration Tooling: Open Source Debezium/Kafka
Post-Go-Live Support: 14 days included
Security Certification: SOC 2 Type II Certified`
        },
        {
          fileName: 'vendor_gamma_proposal.pdf',
          content: `PROPOSAL: Cloud Database Migration
Vendor: Gamma Enterprise Group
Total Bid Price: $92,000.00
Implementation Timeline: 6 weeks
Support Level: 24/7 Dedicated White-Glove Support
SLA Guarantee: 99.99%
Dedicated Project Manager: Yes (Senior Certified PMP)
Data Migration Tooling: AWS Database Migration Service (DMS)
Post-Go-Live Support: 90 days included
Security Certification: SOC 2 Type II, ISO 27001, HIPAA Compliant`
        }
      ]
    }
  ];

  /**
   * Main compare method implementing full specification rules
   */
  async compareDocuments(
    request: CompareRequest,
    apiKey?: string
  ): Promise<CompareResponse> {
    // 1. Enforce Plan Rules Client-Side & Defensively
    if (request.plan === 'free' && request.documents.length > 2) {
      return {
        summary: {
          totalFieldsCompared: 0,
          unchanged: 0,
          valueChanged: 0,
          added: 0,
          removed: 0
        },
        differences: [],
        renderedOutput: '',
        error: 'PLAN_LIMIT_EXCEEDED',
        message: 'Free plan supports comparing 2 files only. Upgrade to Pro to compare more files.',
        maxFilesAllowed: 2
      };
    }

    if (request.documents.length < 2) {
      return {
        summary: {
          totalFieldsCompared: 0,
          unchanged: 0,
          valueChanged: 0,
          added: 0,
          removed: 0
        },
        differences: [],
        renderedOutput: '',
        error: 'INSUFFICIENT_DOCUMENTS',
        message: 'Please provide at least 2 documents to compare.'
      };
    }

    // 2. If user provided a live Claude Anthropic API key, execute live API call
    if (apiKey && apiKey.trim().startsWith('sk-ant-')) {
      try {
        const liveResult = await this.callClaudeApi(request, apiKey.trim());
        if (liveResult) {
          return liveResult;
        }
      } catch (err: any) {
        console.warn('Live API call failed, using high-fidelity local deterministic engine:', err);
      }
    }

    // 3. High-fidelity client-side deterministic engine implementing exact rules
    return this.executeDeterministicDiff(request);
  }

  /**
   * Deterministic local comparison engine
   */
  private executeDeterministicDiff(request: CompareRequest): CompareResponse {
    const docs = request.documents;
    const plan = request.plan;
    const outputFormat = request.outputFormat;

    const warning = this.checkExtractionWarnings(docs);

    if (docs.length === 2 || plan === 'free') {
      const doc1 = docs[0];
      const doc2 = docs[1];

      const parsed1 = this.parseDocumentFields(doc1.content);
      const parsed2 = this.parseDocumentFields(doc2.content);

      const isMismatch = this.detectDocumentMismatch(doc1.content, doc2.content);

      const allDiffs: DiffItem[] = [];
      const unchangedList: DiffItem[] = [];
      const processedKeysDoc2 = new Set<string>();

      // Iterate through doc1 keys
      for (const item1 of parsed1) {
        const match = this.findMatchingField(item1, parsed2, processedKeysDoc2);

        if (match) {
          processedKeysDoc2.add(match.normalizedKey);
          const val1 = item1.value.trim();
          const val2 = match.value.trim();

          if (val1 === val2) {
            unchangedList.push({
              fieldName: item1.originalLabel,
              status: 'unchanged',
              valueInFile1: val1,
              valueInFile2: val2,
              file1: doc1.fileName,
              file2: doc2.fileName
            });
          } else {
            const isLabelVar = item1.originalLabel.toLowerCase() !== match.originalLabel.toLowerCase();
            const status: DiffStatus = isLabelVar ? 'label_variation' : 'value_changed';

            allDiffs.push({
              fieldName: item1.originalLabel,
              status: status,
              valueInFile1: val1,
              valueInFile2: val2,
              file1: doc1.fileName,
              file2: doc2.fileName,
              label1: item1.originalLabel,
              label2: match.originalLabel,
              changeSummary: `${item1.originalLabel} changed from "${val1}" to "${val2}"${isLabelVar ? ` (labeled as "${match.originalLabel}" in ${doc2.fileName})` : ''}`
            });
          }
        } else {
          // Removed in doc2
          allDiffs.push({
            fieldName: item1.originalLabel,
            status: 'removed',
            valueInFile1: item1.value.trim(),
            valueInFile2: undefined,
            file1: doc1.fileName,
            file2: doc2.fileName,
            changeSummary: `${item1.originalLabel} ("${item1.value.trim()}") was removed`
          });
        }
      }

      // Check for added keys in doc2
      for (const item2 of parsed2) {
        if (!processedKeysDoc2.has(item2.normalizedKey)) {
          allDiffs.push({
            fieldName: item2.originalLabel,
            status: 'added',
            valueInFile1: undefined,
            valueInFile2: item2.value.trim(),
            file1: doc1.fileName,
            file2: doc2.fileName,
            changeSummary: `${item2.originalLabel} with value "${item2.value.trim()}" was added`
          });
        }
      }

      // If key-value parsing yielded low field count (< 2), perform smart sentence/line diff
      if (parsed1.length <= 1 && parsed2.length <= 1) {
        const textDiffs = this.compareTextParagraphs(doc1, doc2);
        for (const td of textDiffs) {
          allDiffs.push(td);
        }
      }

      const totalFieldsCompared = unchangedList.length + allDiffs.length;
      const valueChangedCount = allDiffs.filter(d => d.status === 'value_changed' || d.status === 'label_variation').length;
      const addedCount = allDiffs.filter(d => d.status === 'added').length;
      const removedCount = allDiffs.filter(d => d.status === 'removed').length;
      const labelVarCount = allDiffs.filter(d => d.status === 'label_variation').length;

      const summary: CompareSummary = {
        totalFieldsCompared,
        unchanged: unchangedList.length,
        valueChanged: valueChangedCount,
        added: addedCount,
        removed: removedCount,
        labelVariations: labelVarCount
      };

      const renderedOutput = this.shapeRenderedOutput(outputFormat, summary, allDiffs, doc1.fileName, doc2.fileName, isMismatch);

      return {
        summary,
        differences: allDiffs,
        renderedOutput,
        extractionWarning: warning || (isMismatch ? 'Notice: The compared files appear to belong to differing document categories.' : undefined)
      };
    } else {
      return this.executeMultiFileDiff(request, warning);
    }
  }

  /**
   * Multi-file comparison for Pro tier
   */
  private executeMultiFileDiff(request: CompareRequest, warning?: string): CompareResponse {
    const docs = request.documents;
    const baseDoc = docs[0];
    const diffs: DiffItem[] = [];
    let totalFields = 0;
    let unchangedTotal = 0;

    for (let i = 1; i < docs.length; i++) {
      const comparePairDoc = docs[i];
      const parsedBase = this.parseDocumentFields(baseDoc.content);
      const parsedTarget = this.parseDocumentFields(comparePairDoc.content);
      const processed = new Set<string>();

      for (const item1 of parsedBase) {
        const match = this.findMatchingField(item1, parsedTarget, processed);
        if (match) {
          processed.add(match.normalizedKey);
          if (item1.value.trim() === match.value.trim()) {
            unchangedTotal++;
          } else {
            diffs.push({
              fieldName: item1.originalLabel,
              status: 'value_changed',
              valueInFile1: item1.value.trim(),
              valueInFile2: match.value.trim(),
              file1: baseDoc.fileName,
              file2: comparePairDoc.fileName,
              label1: item1.originalLabel,
              label2: match.originalLabel,
              changeSummary: `${item1.originalLabel}: "${item1.value.trim()}" in ${baseDoc.fileName} vs "${match.value.trim()}" in ${comparePairDoc.fileName}`
            });
          }
        } else {
          diffs.push({
            fieldName: item1.originalLabel,
            status: 'removed',
            valueInFile1: item1.value.trim(),
            valueInFile2: undefined,
            file1: baseDoc.fileName,
            file2: comparePairDoc.fileName
          });
        }
      }

      for (const item2 of parsedTarget) {
        if (!processed.has(item2.normalizedKey)) {
          diffs.push({
            fieldName: item2.originalLabel,
            status: 'added',
            valueInFile1: undefined,
            valueInFile2: item2.value.trim(),
            file1: baseDoc.fileName,
            file2: comparePairDoc.fileName
          });
        }
      }
    }

    totalFields = unchangedTotal + diffs.length;
    const valueChanged = diffs.filter(d => d.status === 'value_changed' || d.status === 'label_variation').length;
    const added = diffs.filter(d => d.status === 'added').length;
    const removed = diffs.filter(d => d.status === 'removed').length;

    const summary: CompareSummary = {
      totalFieldsCompared: totalFields,
      unchanged: unchangedTotal,
      valueChanged,
      added,
      removed
    };

    const renderedOutput = this.shapeRenderedOutput(request.outputFormat, summary, diffs, baseDoc.fileName, 'Multiple files', false);

    return {
      summary,
      differences: diffs,
      renderedOutput,
      extractionWarning: warning
    };
  }

  /**
   * Shape renderedOutput string based on OutputFormat
   */
  public shapeRenderedOutput(
    format: OutputFormat,
    summary: CompareSummary,
    diffs: DiffItem[],
    file1: string,
    file2: string,
    isMismatch: boolean
  ): string {
    switch (format) {
      case 'table': {
        let md = `| Field | ${file1} | ${file2} | Status |\n|---|---|---|---|\n`;
        if (diffs.length === 0) {
          md += `| *(No differences found)* | Identical | Identical | Unchanged |\n`;
        } else {
          for (const d of diffs) {
            const v1 = (d.valueInFile1 || '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
            const v2 = (d.valueInFile2 || '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
            const statusStr = d.status === 'value_changed' ? 'Changed'
              : d.status === 'added' ? 'Added'
              : d.status === 'removed' ? 'Removed'
              : d.status === 'label_variation' ? 'Label Var.'
              : 'Unchanged';
            md += `| ${d.fieldName} | ${v1} | ${v2} | ${statusStr} |\n`;
          }
        }
        return md;
      }

      case 'json': {
        return JSON.stringify(diffs, null, 2);
      }

      case 'summary': {
        if (isMismatch) {
          return `Document type divergence detected: The files appear to represent different document categories. ${diffs.length} field discrepancies and structural differences were noted across ${summary.totalFieldsCompared} analyzed entities.`;
        }
        if (diffs.length === 0) {
          return `Comparison complete: All ${summary.totalFieldsCompared} extracted fields between "${file1}" and "${file2}" match identically with zero discrepancies detected.`;
        }
        const topChanged = diffs.filter(d => d.status === 'value_changed' || d.status === 'label_variation').slice(0, 3).map(d => d.fieldName).join(', ');
        return `Comparison completed between "${file1}" and "${file2}". Out of ${summary.totalFieldsCompared} total fields compared, ${summary.valueChanged} values changed${topChanged ? ` (notably in ${topChanged})` : ''}, ${summary.added} new fields were added, and ${summary.removed} were removed. ${summary.unchanged} fields remained unchanged.`;
      }

      case 'highlight': {
        const highlights = diffs.map(d => {
          if (d.status === 'value_changed' || d.status === 'label_variation') {
            return `${d.fieldName} changed from ${d.valueInFile1} to ${d.valueInFile2}`;
          } else if (d.status === 'added') {
            return `${d.fieldName} ("${d.valueInFile2}") was added`;
          } else if (d.status === 'removed') {
            return `${d.fieldName} ("${d.valueInFile1}") was removed`;
          }
          return `${d.fieldName} modified`;
        });
        return JSON.stringify(highlights, null, 2);
      }
    }
  }

  /**
   * Advanced multi-strategy document field extractor
   * Handles:
   * 1. Colon / Dash / Equals key-value pairs (e.g. "Invoice Number: 1001", "Due Date - 2026-08-15")
   * 2. Tabular multi-column lines (e.g. "Employee Code  1019942  Employee name  Logesh S")
   * 3. Header title expressions (e.g. "Payslip For The Month Of July 2026")
   * 4. Numeric & financial table line items (e.g. "Basic Salary  21,100.00", "TAXABLE INCOME  240,250.00")
   */
  public parseDocumentFields(content: string): { originalLabel: string; normalizedKey: string; value: string }[] {
    const lines = content.split('\n');
    const fields: { originalLabel: string; normalizedKey: string; value: string }[] = [];
    const seen = new Set<string>();

    const addField = (label: string, val: string) => {
      const cleanLabel = label.trim().replace(/^[\:\-\•\*\s]+|[\:\-\•\*\s]+$/g, '');
      const cleanVal = val.trim();
      const norm = this.normalizeKey(cleanLabel);

      // Filter out non-entity headers like table titles "Particulars Amount" or pure company address
      if (
        cleanLabel.length >= 2 &&
        cleanVal.length >= 1 &&
        norm &&
        !seen.has(norm) &&
        !['particulars', 'earnings', 'deductions', 'income tax calculation', 'other details'].includes(norm)
      ) {
        seen.add(norm);
        fields.push({
          originalLabel: cleanLabel,
          normalizedKey: norm,
          value: cleanVal
        });
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Strategy 1: Header/Title expressions like "Payslip For The Month Of July 2026"
      const payslipHeaderMatch = line.match(/^(Payslip\s+For\s+The\s+Month\s+Of)\s*[\:\-\s]\s*(.+)$/i);
      if (payslipHeaderMatch) {
        addField(payslipHeaderMatch[1], payslipHeaderMatch[2]);
        continue;
      }

      // Strategy 2: Multi-column or multiple space / tab separated pairs on a single line
      // e.g. "Employee Code  1019942  Employee name  Logesh S"
      // or "Date of Joining  06 Aug 2025  Bank Name  Bank of India"
      // or "Basic Salary  21,100.00  Profession Tax  208.00"
      const multiColSegments = line.split(/\s{2,}|\t/).map(s => s.trim()).filter(Boolean);

      if (multiColSegments.length >= 2) {
        let isHandled = false;

        // Check if segments are alternating [Key, Value, Key, Value]
        if (multiColSegments.length % 2 === 0) {
          let looksLikePairs = true;
          for (let k = 0; k < multiColSegments.length; k += 2) {
            const potentialKey = multiColSegments[k];
            const potentialVal = multiColSegments[k + 1];
            // If the key is pure numeric and value is text, this might not be key->value
            if (/^\d+(\.\d+)?$/.test(potentialKey) && !/^\d+(\.\d+)?$/.test(potentialVal)) {
              looksLikePairs = false;
              break;
            }
          }

          if (looksLikePairs) {
            for (let k = 0; k < multiColSegments.length; k += 2) {
              const kStr = multiColSegments[k];
              const vStr = multiColSegments[k + 1];
              // If kStr contains colon inside, split by colon
              if (kStr.includes(':')) {
                const [innerK, innerV] = kStr.split(/:(.+)/);
                if (innerK && innerV) addField(innerK, innerV);
              } else {
                addField(kStr, vStr);
              }
            }
            isHandled = true;
          }
        }

        if (isHandled) continue;

        // Try extracting individually from each column segment
        for (const seg of multiColSegments) {
          this.parseSingleLineSegment(seg, addField);
        }
        continue;
      }

      // Strategy 3: Single line parsing
      this.parseSingleLineSegment(line, addField);
    }

    return fields;
  }

  private parseSingleLineSegment(segment: string, addField: (k: string, v: string) => void): void {
    const s = segment.trim();
    if (!s) return;

    // Colon separator (e.g. "Employee Code: 1019942" or "In words ( ₹ ) : Thirty-two...")
    const colonIdx = s.indexOf(':');
    if (colonIdx > 0 && colonIdx < 60) {
      const k = s.substring(0, colonIdx).trim();
      const v = s.substring(colonIdx + 1).trim();
      if (k && v) {
        addField(k, v);
        return;
      }
    }

    // Dash separator (e.g. "Item 1: Enterprise Cloud Hosting (12 mo) - $12,000.00")
    const dashIdx = s.indexOf(' - ');
    if (dashIdx > 0 && dashIdx < 60) {
      const k = s.substring(0, dashIdx).trim();
      const v = s.substring(dashIdx + 3).trim();
      if (k && v) {
        addField(k, v);
        return;
      }
    }

    // Equals separator
    const equalsIdx = s.indexOf('=');
    if (equalsIdx > 0 && equalsIdx < 60) {
      const k = s.substring(0, equalsIdx).trim();
      const v = s.substring(equalsIdx + 1).trim();
      if (k && v) {
        addField(k, v);
        return;
      }
    }

    // Financial / Table entry pattern: Text label followed by numbers/currency at the end
    // e.g. "TAXABLE INCOME 240,250.00" or "EARNING FOR TAX WITH PERKS 315,248.00" or "Basic Salary 21,100.00"
    const trailingNumberMatch = s.match(/^([A-Za-z\s\(\)\/\,\.\-\_]{3,})\s+([\$\₹\€\£]?\s*[\d\,]+(\.\d{2})?\%?)$/);
    if (trailingNumberMatch) {
      const k = trailingNumberMatch[1].trim();
      const v = trailingNumberMatch[2].trim();
      if (k && v && !/^(page|step|item|part|total)$/i.test(k)) {
        addField(k, v);
        return;
      }
    }

    // Date value pattern at the end: e.g. "Date of Joining 06 Aug 2025" or "Effective Date October 1, 2026"
    const trailingDateMatch = s.match(/^([A-Za-z\s\(\)\/\,\.\-\_]{3,})\s+((?:\d{1,2}[\/\-\s])?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\/\-\s]\d{2,4}|\d{4}-\d{2}-\d{2})$/i);
    if (trailingDateMatch) {
      const k = trailingDateMatch[1].trim();
      const v = trailingDateMatch[2].trim();
      if (k && v) {
        addField(k, v);
        return;
      }
    }
  }

  private normalizeKey(key: string): string {
    return key
      .toLowerCase()
      .replace(/[\:\-\_\.\,\(\)\#\/\₹\$\€]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Match field names with tolerance for label variations
   */
  private findMatchingField(
    source: { originalLabel: string; normalizedKey: string; value: string },
    targetList: { originalLabel: string; normalizedKey: string; value: string }[],
    alreadyMatched: Set<string>
  ) {
    // 1. Exact normalized match
    const exact = targetList.find(t => t.normalizedKey === source.normalizedKey && !alreadyMatched.has(t.normalizedKey));
    if (exact) return exact;

    // 2. Common synonym / label variations mappings
    const synonyms: Record<string, string[]> = {
      'payslip for the month of': ['payslip month', 'month of', 'pay period', 'for the month of'],
      'invoice number': ['invoice no', 'invoice id', 'inv no', 'inv num', 'bill no'],
      'invoice date': ['date', 'issue date', 'billing date'],
      'due date': ['payment due', 'due by', 'payment due date'],
      'total amount due': ['total due', 'total amount', 'total', 'amount due', 'balance due', 'grand total', 'net salary'],
      'subtotal': ['sub total', 'amount before tax', 'net total'],
      'tax amount': ['tax', 'sales tax', 'vat amount', 'vat'],
      'initial term': ['term', 'contract term', 'duration', 'agreement term'],
      'base salary': ['salary', 'annual salary', 'base compensation', 'compensation', 'basic salary'],
      'signing bonus': ['sign on bonus', 'signon bonus', 'starting bonus'],
      'equity incentive': ['equity grant', 'stock options', 'stock grant', 'options', 'rsus'],
      'vacation pto': ['vacation', 'pto', 'annual leave', 'paid time off'],
      'limitation of liability': ['liability cap', 'liability limit', 'aggregate liability'],
      'taxable income': ['taxable amount', 'taxable gross', 'net taxable income'],
      'earning for tax with perks': ['earnings for tax', 'taxable perks earning', 'gross tax earnings']
    };

    const sKey = source.normalizedKey;
    for (const [canonical, variants] of Object.entries(synonyms)) {
      const family = [canonical, ...variants];
      if (family.includes(sKey)) {
        const synMatch = targetList.find(t => family.includes(t.normalizedKey) && !alreadyMatched.has(t.normalizedKey));
        if (synMatch) return synMatch;
      }
    }

    // 3. Substring match
    for (const target of targetList) {
      if (alreadyMatched.has(target.normalizedKey)) continue;
      if (
        (target.normalizedKey.includes(sKey) || sKey.includes(target.normalizedKey)) &&
        Math.min(target.normalizedKey.length, sKey.length) > 5
      ) {
        return target;
      }
    }

    return undefined;
  }

  /**
   * Compare text-heavy sections/paragraphs
   */
  private compareTextParagraphs(doc1: { fileName: string; content: string }, doc2: { fileName: string; content: string }): DiffItem[] {
    const textDiffs: DiffItem[] = [];
    const extractLines = (content: string) => {
      return content
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 20);
    };

    const p1 = extractLines(doc1.content);
    const p2 = extractLines(doc2.content);

    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const clause1 = p1[i];
      const clause2 = p2[i];

      if (clause1 && clause2 && clause1 !== clause2) {
        textDiffs.push({
          fieldName: `Section / Row ${i + 1}`,
          status: 'value_changed',
          valueInFile1: clause1.substring(0, 180) + (clause1.length > 180 ? '...' : ''),
          valueInFile2: clause2.substring(0, 180) + (clause2.length > 180 ? '...' : ''),
          file1: doc1.fileName,
          file2: doc2.fileName,
          excerptBefore: clause1.substring(0, 200),
          excerptAfter: clause2.substring(0, 200),
          changeSummary: `Line change: "${clause1.substring(0, 50)}..." vs "${clause2.substring(0, 50)}..."`
        });
      }
    }

    return textDiffs;
  }

  private detectDocumentMismatch(content1: string, content2: string): boolean {
    const lower1 = content1.toLowerCase();
    const lower2 = content2.toLowerCase();

    const isInvoice1 = lower1.includes('invoice') || lower1.includes('subtotal') || lower1.includes('amount due');
    const isInvoice2 = lower2.includes('invoice') || lower2.includes('subtotal') || lower2.includes('amount due');

    const isResume1 = lower1.includes('resume') || lower1.includes('curriculum vitae') || (lower1.includes('education') && lower1.includes('experience'));
    const isResume2 = lower2.includes('resume') || lower2.includes('curriculum vitae') || (lower2.includes('education') && lower2.includes('experience'));

    if ((isInvoice1 && isResume2) || (isResume1 && isInvoice2)) {
      return true;
    }
    return false;
  }

  private checkExtractionWarnings(docs: { fileName: string; content: string }[]): string | undefined {
    for (const doc of docs) {
      if (doc.content.length < 20) {
        return `Extraction warning in "${doc.fileName}": Content appears very sparse or empty. Verify PDF text layers.`;
      }
      if (/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]{4,}/.test(doc.content)) {
        return `OCR / Encoding warning in "${doc.fileName}": Detected garbled or unreadable characters in extracted stream.`;
      }
    }
    return undefined;
  }

  /**
   * Optional Live Claude API caller
   */
  private async callClaudeApi(request: CompareRequest, apiKey: string): Promise<CompareResponse | null> {
    const userPayload = JSON.stringify(request);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPayload
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as CompareResponse;
      }
    }
    return null;
  }
}
