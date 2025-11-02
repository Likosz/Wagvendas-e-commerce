import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';
import type { SwiperContainer } from 'swiper/element';

// Data
import { Category } from '../../../../core/interfaces/category.interface';
import { CATEGORIES_MOCK } from '../../../../core/data/categories.data';

@Component({
  selector: 'app-categories-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './categories-carousel.html',
  styleUrl: './categories-carousel.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoriesCarousel implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly icons = {
    ChevronRight,
  };

  public categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.categories.set(CATEGORIES_MOCK.filter((cat) => cat.featured));

    // Inicializa Swiper apenas no browser (SSR-safe)
    if (isPlatformBrowser(this.platformId)) {
      this.initSwiper();
    }
  }

  private async initSwiper(): Promise<void> {
    const { register } = await import('swiper/element/bundle');
    register();

    setTimeout(() => {
      const swiperEl = document.querySelector('swiper-container') as SwiperContainer;

      if (swiperEl) {
        // Configurações do Swiper
        const swiperParams = {
          slidesPerView: 1,
          spaceBetween: 16,
          loop: false,
          autoplay: {
            delay: 4000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          },
          pagination: {
            enabled: true,
            clickable: true,
          },
          navigation: {
            enabled: true,
          },
          keyboard: {
            enabled: true,
            onlyInViewport: true,
          },
          a11y: {
            enabled: true,
            prevSlideMessage: 'Categoria anterior',
            nextSlideMessage: 'Próxima categoria',
            firstSlideMessage: 'Primeira categoria',
            lastSlideMessage: 'Última categoria',
          },
          breakpoints: {
            // Mobile
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            // Tablet
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            // Desktop
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            // Large Desktop
            1280: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          },
        };

        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
      }
    }, 100);
  }
}
