import { Component, signal, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CatApiService } from '../../services/cat-api.service';

@Component({
  standalone: true,
  imports: [NgFor, MatCardModule],
  template: `
    <mat-card *ngFor="let b of breeds()">
      <h3>{{b.name}}</h3>
      <p>{{b.temperament}}</p>
    </mat-card>
  `
})
export class BreedsComponent {
  private api = inject(CatApiService);
  breeds = signal<any[]>([]);

  constructor() {
    this.api.getBreeds().subscribe(res => this.breeds.set(res));
  }
}