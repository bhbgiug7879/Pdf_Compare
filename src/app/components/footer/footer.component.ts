import { Component, EventEmitter, Output } from '@angular/core';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { CategoryInfo } from '../../models/tool.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Output() openHelp = new EventEmitter<void>();
  @Output() openContact = new EventEmitter<void>();
  @Output() openHistory = new EventEmitter<void>();

  categories: CategoryInfo[] = [];
  currentYear = new Date().getFullYear();

  constructor(public toolRegistry: ToolRegistryService) {
    this.categories = this.toolRegistry.getCategories();
  }
}
