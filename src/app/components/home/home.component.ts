import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { CategoryInfo, ToolCategory, ToolDefinition } from '../../models/tool.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: CategoryInfo[] = [];
  allTools: ToolDefinition[] = [];
  filteredTools: ToolDefinition[] = [];
  selectedCategory: ToolCategory | 'all' = 'all';
  searchQuery: string = '';

  constructor(
    public toolRegistry: ToolRegistryService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.setHomePageSeo();
    this.categories = this.toolRegistry.getCategories();
    this.allTools = this.toolRegistry.getAllTools();
    this.applyFilter();
  }

  setCategoryFilter(cat: ToolCategory | 'all'): void {
    this.selectedCategory = cat;
    this.applyFilter();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = this.allTools;

    if (this.selectedCategory !== 'all') {
      result = result.filter(t => t.category === this.selectedCategory);
    }

    if (this.searchQuery.trim().length > 0) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    this.filteredTools = result;
  }
}
