import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private _isDarkMode: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  get isDarkMode() {
    return this._isDarkMode;
  }

  set isDarkMode(value: boolean) {
    this._isDarkMode = value;
    if (this._isDarkMode) {
      this.document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
