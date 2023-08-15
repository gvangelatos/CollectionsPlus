import { Component, OnInit } from '@angular/core';
import { DarkModeService } from './services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private darkModeService: DarkModeService) {}
  ngOnInit(): void {
    if (localStorage.getItem('darkMode')) {
      this.darkModeService.isDarkMode =
        localStorage.getItem('darkMode') === 'true';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkModeService.isDarkMode = true;
    } else {
      this.darkModeService.isDarkMode = false;
    }
  }

  onLogout() {}
}
