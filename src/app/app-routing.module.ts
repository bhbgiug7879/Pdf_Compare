import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { ToolPageComponent } from './components/shared/tool-page/tool-page.component';
import { CompareToolComponent } from './components/compare-tool/compare-tool.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'compare-pdf', component: CompareToolComponent },
  { path: 'admin', component: AdminComponent },

  // 1. Organize PDF Tools
  { path: 'merge-pdf', component: ToolPageComponent, data: { toolSlug: 'merge-pdf' } },
  { path: 'split-pdf', component: ToolPageComponent, data: { toolSlug: 'split-pdf' } },
  { path: 'remove-pages', component: ToolPageComponent, data: { toolSlug: 'remove-pages' } },
  { path: 'extract-pages', component: ToolPageComponent, data: { toolSlug: 'extract-pages' } },
  { path: 'organize-pdf', component: ToolPageComponent, data: { toolSlug: 'organize-pdf' } },
  { path: 'scan-to-pdf', component: ToolPageComponent, data: { toolSlug: 'scan-to-pdf' } },

  // 2. Optimize PDF Tools
  { path: 'compress-pdf', component: ToolPageComponent, data: { toolSlug: 'compress-pdf' } },
  { path: 'repair-pdf', component: ToolPageComponent, data: { toolSlug: 'repair-pdf' } },
  { path: 'ocr-pdf', component: ToolPageComponent, data: { toolSlug: 'ocr-pdf' } },

  // 3. Convert to PDF Tools
  { path: 'jpg-to-pdf', component: ToolPageComponent, data: { toolSlug: 'jpg-to-pdf' } },
  { path: 'word-to-pdf', component: ToolPageComponent, data: { toolSlug: 'word-to-pdf' } },
  { path: 'powerpoint-to-pdf', component: ToolPageComponent, data: { toolSlug: 'powerpoint-to-pdf' } },
  { path: 'excel-to-pdf', component: ToolPageComponent, data: { toolSlug: 'excel-to-pdf' } },
  { path: 'html-to-pdf', component: ToolPageComponent, data: { toolSlug: 'html-to-pdf' } },

  // 4. Convert from PDF Tools
  { path: 'pdf-to-jpg', component: ToolPageComponent, data: { toolSlug: 'pdf-to-jpg' } },
  { path: 'pdf-to-word', component: ToolPageComponent, data: { toolSlug: 'pdf-to-word' } },
  { path: 'pdf-to-powerpoint', component: ToolPageComponent, data: { toolSlug: 'pdf-to-powerpoint' } },
  { path: 'pdf-to-excel', component: ToolPageComponent, data: { toolSlug: 'pdf-to-excel' } },
  { path: 'pdf-to-pdfa', component: ToolPageComponent, data: { toolSlug: 'pdf-to-pdfa' } },

  // 5. Edit PDF Tools
  { path: 'rotate-pdf', component: ToolPageComponent, data: { toolSlug: 'rotate-pdf' } },
  { path: 'add-page-numbers', component: ToolPageComponent, data: { toolSlug: 'add-page-numbers' } },
  { path: 'add-watermark', component: ToolPageComponent, data: { toolSlug: 'add-watermark' } },
  { path: 'crop-pdf', component: ToolPageComponent, data: { toolSlug: 'crop-pdf' } },
  { path: 'edit-pdf', component: ToolPageComponent, data: { toolSlug: 'edit-pdf' } },
  { path: 'pdf-forms', component: ToolPageComponent, data: { toolSlug: 'pdf-forms' } },

  // 6. Security PDF Tools
  { path: 'unlock-pdf', component: ToolPageComponent, data: { toolSlug: 'unlock-pdf' } },
  { path: 'protect-pdf', component: ToolPageComponent, data: { toolSlug: 'protect-pdf' } },
  { path: 'sign-pdf', component: ToolPageComponent, data: { toolSlug: 'sign-pdf' } },
  { path: 'redact-pdf', component: ToolPageComponent, data: { toolSlug: 'redact-pdf' } },

  // 7. Intelligence PDF Tools
  { path: 'ai-summarizer', component: ToolPageComponent, data: { toolSlug: 'ai-summarizer' } },
  { path: 'translate-pdf', component: ToolPageComponent, data: { toolSlug: 'translate-pdf' } },
  { path: 'pdf-to-markdown', component: ToolPageComponent, data: { toolSlug: 'pdf-to-markdown' } },

  // Fallback Wildcard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
