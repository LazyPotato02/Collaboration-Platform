import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <a routerLink="/" class="btn">Back to Home</a>
    </div>
  `,
    styles: [`
    .not-found {
      text-align: center;
      padding: 4rem 2rem;
    }
    h1 {
      font-size: 5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.25rem;
      color: #888;
      margin-bottom: 2rem;
    }
    .btn {
      background-color: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
    }
  `]
})
export class PageNotFoundComponent {}
