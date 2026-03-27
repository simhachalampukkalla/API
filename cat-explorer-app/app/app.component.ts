import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>🐱 Cat Explorer</span>
      <span style="flex:1"></span>
      <a mat-button routerLink="/">Home</a>
      <a mat-button routerLink="/breeds">Breeds</a>
      <a mat-button routerLink="/favorites">Favorites</a>
      <a mat-button routerLink="/upload">Upload</a>
    </mat-toolbar>

    <router-outlet />
  `
})
export class AppComponent {}
