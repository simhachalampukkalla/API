import { Component, OnInit, signal } from '@angular/core';
import { CatApiService, CatImage } from '../../services/cat-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div style="padding: 16px;">
      <h2>Cat Explorer</h2>
      <button (click)="reloadCats()">Reload Cats</button>
      <div
        style="display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px;"
      >
        <div
          *ngFor="let cat of cats()"
          style="border: 1px solid #ccc; padding: 8px; width: 220px;"
        >
          <img [src]="cat.url" [alt]="cat.id" width="200" />
          <button
            (click)="addToFavourites(cat.id)"
            style="margin-top: 8px;"
          >
            ❤ Add to favourites
          </button>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  // Typed Signal to store cat images
  cats = signal<CatImage[]>([]);

  constructor(private api: CatApiService) {}

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.api.getCats().subscribe({
      next: (res: CatImage[]) => this.cats.set(res),
      error: (err: HttpErrorResponse) =>
        console.error('Failed to load cats:', err),
    });
  }

  addToFavourites(id: string): void {
    this.api.addFavourite(id).subscribe({
      next: () => console.log(`Added ${id} to favourites`),
      error: (err: HttpErrorResponse) =>
        console.error('Failed to add favourite:', err),
    });
  }

  reloadCats(): void {
    this.loadCats();
  }
}