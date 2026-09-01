import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { SeoService } from '../../services/seo.service';
import { CategoryInfo, ToolDefinition } from '../../models/tool.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: CategoryInfo | undefined;
  tools: ToolDefinition[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public toolRegistry: ToolRegistryService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('id') || '';
      this.category = this.toolRegistry.getCategoryBySlug(slug);
      if (this.category) {
        this.seoService.setCategoryPageSeo(this.category);
        this.tools = this.toolRegistry.getToolsByCategory(this.category.id);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
