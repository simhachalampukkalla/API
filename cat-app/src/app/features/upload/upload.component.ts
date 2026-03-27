import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CatApiService } from '../../services/cat-api.service';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <input type="file" (change)="upload($event)" />
  `
})
export class UploadComponent {
  private api = inject(CatApiService);

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.api.upload(file).subscribe();
    }
  }
}