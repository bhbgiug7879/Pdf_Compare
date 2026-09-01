import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService, AppTheme } from '../../services/theme.service';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { HistoryService } from '../../services/history.service';
import { CategoryInfo, ToolDefinition } from '../../models/tool.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() openHelp = new EventEmitter<void>();
  @Output() openSecurity = new EventEmitter<void>();
  @Output() openPro = new EventEmitter<void>();
  @Output() openHistory = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();

  categories: CategoryInfo[] = [];
  isCategoryMenuOpen = false;
  isMobileMenuOpen = false;
  searchQuery = '';
  searchResults: ToolDefinition[] = [];
  isSearchOpen = false;
  currentTheme: AppTheme = 'dark';

  constructor(
    public themeService: ThemeService,
    public toolRegistry: ToolRegistryService,
    public historyService: HistoryService,
    private router: Router
  ) {
    this.categories = this.toolRegistry.getCategories();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleCategoryMenu(): void {
    this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
  }

  closeCategoryMenu(): void {
    this.isCategoryMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    if (this.searchQuery.trim().length > 0) {
      this.searchResults = this.toolRegistry.searchTools(this.searchQuery).slice(0, 6);
      this.isSearchOpen = true;
    } else {
      this.searchResults = [];
      this.isSearchOpen = false;
    }
  }

  selectTool(tool: ToolDefinition): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.closeCategoryMenu();
    this.closeMobileMenu();
    this.router.navigate(['/', tool.slug]);
  }

  navigateToCategory(cat: CategoryInfo): void {
    this.closeCategoryMenu();
    this.closeMobileMenu();
    this.router.navigate(['/category', cat.slug]);
  }
}
