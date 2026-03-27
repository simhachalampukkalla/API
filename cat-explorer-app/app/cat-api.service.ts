import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CatApiService {
  private http = inject(HttpClient);
  private base = 'https://gps6cdg7h9.execute-api.eu-central-1.amazonaws.com/prod';

  getCats() {
    return this.http.get<any[]>(`${this.base}/images/search?limit=10`);
  }

  getBreeds() {
    return this.http.get<any[]>(`${this.base}/breeds`);
  }

  addFavourite(image_id: string) {
    return this.http.post(`${this.base}/favourites`, { image_id });
  }

  getFavourites() {
    return this.http.get<any[]>(`${this.base}/favourites`);
  }

  vote(image_id: string, value: number) {
    return this.http.post(`${this.base}/votes`, { image_id, value });
  }

  upload(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.base}/images/upload`, form);
  }
}
