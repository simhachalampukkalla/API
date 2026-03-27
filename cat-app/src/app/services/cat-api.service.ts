import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces for type safety
export interface CatImage {
  id: string;
  url: string;
  breeds: any[];
}

export interface Breed {
  id: string;
  name: string;
}

export interface Favourite {
  id: string;
  image_id: string;
}

@Injectable({ providedIn: 'root' })
export class CatApiService {
  private http = inject(HttpClient);
  private base = 'https://gps6cdg7h9.execute-api.eu-central-1.amazonaws.com/prod';
  private headers = new HttpHeaders({
    'x-api-key': 'YOUR_API_KEY_HERE' // replace with your real key
  });

  getCats(limit: number = 10): Observable<CatImage[]> {
    return this.http.get<CatImage[]>(`${this.base}/images/search?limit=${limit}`, { headers: this.headers });
  }

  getBreeds(): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.base}/breeds`, { headers: this.headers });
  }

  getFavourites(): Observable<Favourite[]> {
    return this.http.get<Favourite[]>(`${this.base}/favourites`, { headers: this.headers });
  }

  addFavourite(image_id: string): Observable<any> {
    return this.http.post(`${this.base}/favourites`, { image_id }, { headers: this.headers });
  }

  upload(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.base}/images/upload`, form, { headers: this.headers });
  }

  vote(image_id: string, value: number): Observable<any> {
    return this.http.post(`${this.base}/votes`, { image_id, value }, { headers: this.headers });
  }
}