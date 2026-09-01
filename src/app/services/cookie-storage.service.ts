import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {
  private isBrowser: boolean;
  private readonly PREFIX = 'pdf_app_enc_';
  private readonly SALT = 'PDF_SECURE_SALT_v1';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Encodes a raw string into an obfuscated, URI-safe Base64 representation
   */
  private encodeData(rawValue: string): string {
    try {
      // Add salt wrapper + URI encode + Base64
      const payload = JSON.stringify({ v: rawValue, s: this.SALT, t: Date.now() });
      const utf8Bytes = encodeURIComponent(payload);
      return btoa(utf8Bytes);
    } catch (e) {
      return encodeURIComponent(rawValue);
    }
  }

  /**
   * Decodes an obfuscated Base64 string back to original raw content
   */
  private decodeData(encodedValue: string): string | null {
    try {
      const decodedUtf8 = atob(encodedValue);
      const parsed = JSON.parse(decodeURIComponent(decodedUtf8));
      if (parsed && typeof parsed.v !== 'undefined' && parsed.s === this.SALT) {
        return parsed.v;
      }
      return parsed ? String(parsed.v) : null;
    } catch (e) {
      try {
        return decodeURIComponent(encodedValue);
      } catch (err) {
        return null;
      }
    }
  }

  /**
   * Set a cookie value in encoded format
   */
  public setItem(key: string, value: string, days: number = 365): void {
    if (!this.isBrowser) return;

    try {
      const encodedKey = `${this.PREFIX}${key}`;
      const encodedVal = this.encodeData(value);
      const maxAge = days * 24 * 60 * 60;
      
      const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${encodedKey}=${encodeURIComponent(encodedVal)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
    } catch (e) {
      console.warn('Could not write encoded cookie:', key, e);
    }
  }

  /**
   * Retrieve and decode a cookie value
   */
  public getItem(key: string): string | null {
    if (!this.isBrowser) return null;

    try {
      const targetName = `${this.PREFIX}${key}=`;
      const cookies = document.cookie.split(';');

      for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(targetName) === 0) {
          const rawEncoded = decodeURIComponent(c.substring(targetName.length));
          return this.decodeData(rawEncoded);
        }
      }
      return null;
    } catch (e) {
      console.warn('Could not read encoded cookie:', key, e);
      return null;
    }
  }

  /**
   * Set JSON object in encoded cookie
   */
  public setObject<T>(key: string, obj: T, days: number = 365): void {
    try {
      this.setItem(key, JSON.stringify(obj), days);
    } catch (e) {
      console.warn('Could not serialize object for cookie:', key, e);
    }
  }

  /**
   * Get and decode JSON object from cookie
   */
  public getObject<T>(key: string): T | null {
    try {
      const item = this.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (e) {
      return null;
    }
  }

  /**
   * Delete a cookie by key
   */
  public removeItem(key: string): void {
    if (!this.isBrowser) return;
    const encodedKey = `${this.PREFIX}${key}`;
    document.cookie = `${encodedKey}=; path=/; max-age=0; SameSite=Lax`;
  }

  /**
   * Clear all application cookies
   */
  public clear(): void {
    if (!this.isBrowser) return;
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const eqPos = c.indexOf('=');
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      if (name.startsWith(this.PREFIX)) {
        document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
      }
    }
  }
}
