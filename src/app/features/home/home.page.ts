import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { Hero } from './components/hero/hero';
import { CategoriesCarousel } from './components/categories-carousel/categories-carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, CategoriesCarousel],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  // Página sem lógica complexa por enquanto
  // Futuramente pode conter lógica de analytics, tracking, etc.
}
