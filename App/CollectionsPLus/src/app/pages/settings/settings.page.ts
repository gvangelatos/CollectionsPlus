import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  darkMode: boolean = false;
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    if (localStorage.getItem('darkMode')) {
      this.darkMode = localStorage.getItem('darkMode') === 'true';
      if (this.darkMode) {
        this.document.body.classList.add('dark');
      } else {
        this.document.body.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true;
      this.document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.darkMode = false;
      localStorage.setItem('darkMode', 'false');
    }
  }

  toggleTheme(event: any) {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      this.document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
