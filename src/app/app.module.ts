import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { ToolPageComponent } from './components/shared/tool-page/tool-page.component';
import { CompareToolComponent } from './components/compare-tool/compare-tool.component';
import { HelpModalComponent } from './components/modals/help-modal/help-modal.component';
import { SecurityModalComponent } from './components/modals/security-modal/security-modal.component';
import { ProModalComponent } from './components/modals/pro-modal/pro-modal.component';
import { HistoryModalComponent } from './components/modals/history-modal/history-modal.component';
import { ContactModalComponent } from './components/modals/contact-modal/contact-modal.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    StatusBadgeComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    CategoryComponent,
    ToolPageComponent,
    CompareToolComponent,
    HelpModalComponent,
    SecurityModalComponent,
    ProModalComponent,
    HistoryModalComponent,
    ContactModalComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
