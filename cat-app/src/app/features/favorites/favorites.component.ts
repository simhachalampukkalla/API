import { Component, signal, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CatApiService } from '../../services/cat-api.service';

@Component({
  standalone: true,
  imports: [NgFor, MatCardModule],
  template: `
    <mat-card *ngFor="let f of favorites()">
      <img [src]="f.image?.url" />
    </mat-card>
  `
})
export class FavoritesComponent {
  private api = inject(CatApiService);
  favorites = signal<any[]>([]);

  constructor() {
    this.api.getFavourites().subscribe(res => this.favorites.set(res));
  }
}