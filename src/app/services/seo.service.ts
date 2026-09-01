import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ToolDefinition, CategoryInfo } from '../models/tool.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;
  private siteUrl = 'https://pdf-compare-emqg.vercel.app';
  private defaultSiteName = 'PDF Master Tools & AI Compare';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public setToolPageSeo(tool: ToolDefinition): void {
    const fullTitle = `${tool.seoTitle} | ${this.defaultSiteName}`;
    const pageUrl = `${this.siteUrl}/${tool.slug}`;

    this.titleService.setTitle(fullTitle);

    // Primary Meta
    this.metaService.updateTag({ name: 'title', content: fullTitle });
    this.metaService.updateTag({ name: 'description', content: tool.metaDescription });
    this.metaService.updateTag({ name: 'keywords', content: tool.keywords.join(', ') });

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: tool.metaDescription });
    this.metaService.updateTag({ property: 'og:url', content: pageUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: this.defaultSiteName });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: tool.metaDescription });
    this.metaService.updateTag({ name: 'twitter:url', content: pageUrl });

    // Canonical link
    this.updateCanonicalLink(pageUrl);

    // Structured Data JSON-LD
    this.injectToolStructuredData(tool, pageUrl);
  }

  public setCategoryPageSeo(category: CategoryInfo): void {
    const fullTitle = `${category.name} Online Free – Best PDF ${category.name} Tools | ${this.defaultSiteName}`;
    const pageUrl = `${this.siteUrl}/category/${category.slug}`;
    const desc = `Explore free online ${category.name} tools. ${category.description} Fast, secure, browser-based WASM processing.`;

    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ name: 'title', content: fullTitle });
    this.metaService.updateTag({ name: 'description', content: desc });
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: desc });
    this.metaService.updateTag({ property: 'og:url', content: pageUrl });
    this.updateCanonicalLink(pageUrl);

    this.injectCategoryStructuredData(category, pageUrl);
  }

  public setHomePageSeo(): void {
    const fullTitle = 'Free PDF Tools & AI PDF Compare – 30+ Online PDF Utilities';
    const pageUrl = `${this.siteUrl}/`;
    const desc = 'Free online PDF tools: Merge, Split, Compress, Convert, Edit, Sign, Protect, OCR, and AI-powered Compare PDF. 100% private, instant client-side WASM processing.';

    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ name: 'title', content: fullTitle });
    this.metaService.updateTag({ name: 'description', content: desc });
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: desc });
    this.metaService.updateTag({ property: 'og:url', content: pageUrl });
    this.updateCanonicalLink(pageUrl);

    this.injectHomeStructuredData();
  }

  private updateCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private injectToolStructuredData(tool: ToolDefinition, pageUrl: string): void {
    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `${pageUrl}#webapp`,
          'name': tool.name,
          'url': pageUrl,
          'applicationCategory': 'UtilitiesApplication',
          'operatingSystem': 'All (Web Browser)',
          'browserRequirements': 'Requires JavaScript and HTML5.',
          'description': tool.metaDescription,
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'featureList': tool.features.map(f => f.title)
        },
        {
          '@type': 'HowTo',
          '@id': `${pageUrl}#howto`,
          'name': `How to use ${tool.name} Online`,
          'description': `Follow these simple steps to use ${tool.name} for free in your browser.`,
          'step': tool.steps.map((step, idx) => ({
            '@type': 'HowToStep',
            'position': idx + 1,
            'name': step.title,
            'text': step.description
          }))
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          'mainEntity': tool.faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': this.siteUrl
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': tool.category,
              'item': `${this.siteUrl}/category/${tool.category}`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': tool.name,
              'item': pageUrl
            }
          ]
        }
      ]
    };

    this.updateJsonLd(schemaData);
  }

  private injectCategoryStructuredData(category: CategoryInfo, pageUrl: string): void {
    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#collection`,
          'name': category.name,
          'url': pageUrl,
          'description': category.description
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': this.siteUrl
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': category.name,
              'item': pageUrl
            }
          ]
        }
      ]
    };
    this.updateJsonLd(schemaData);
  }

  private injectHomeStructuredData(): void {
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'url': this.siteUrl,
      'name': this.defaultSiteName,
      'description': 'Free online PDF utility suite & AI comparison platform.',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${this.siteUrl}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
    this.updateJsonLd(schemaData);
  }

  private updateJsonLd(data: any): void {
    if (!this.isBrowser) return;
    const existingScript = this.doc.getElementById('dynamic-jsonld');
    if (existingScript) {
      existingScript.textContent = JSON.stringify(data);
    } else {
      const script = this.doc.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      this.doc.head.appendChild(script);
    }
  }
}
