import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
} from 'lucide-angular';
import { Product, ProductSortOption } from '../../../core/interfaces/product.interface';
import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../../core/services/product.service';

type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCard],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGrid {
  private productService = inject(ProductService);
  private platformId = inject(PLATFORM_ID);

  @Input() products: Product[] = [];
  @Input() loading: boolean = false;
  @Input() totalProducts: number = 0;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<ProductSortOption>();
  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();
  @Output() quickView = new EventEmitter<Product>();
  @Output() openFilters = new EventEmitter<void>();

  readonly icons = {
    Grid3x3,
    List,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    SlidersHorizontal,
  };

  public viewMode = signal<ViewMode>('grid');
  public selectedSort = signal<ProductSortOption>(ProductSortOption.RELEVANCE);

  // Sort options
  public sortOptions = [
    { value: ProductSortOption.RELEVANCE, label: 'Mais Relevantes' },
    { value: ProductSortOption.PRICE_LOW_HIGH, label: 'Menor Preço' },
    { value: ProductSortOption.PRICE_HIGH_LOW, label: 'Maior Preço' },
    { value: ProductSortOption.NAME_A_Z, label: 'A-Z' },
    { value: ProductSortOption.NAME_Z_A, label: 'Z-A' },
    { value: ProductSortOption.RATING, label: 'Melhor Avaliação' },
    { value: ProductSortOption.NEWEST, label: 'Mais Novos' },
    { value: ProductSortOption.BESTSELLER, label: 'Mais Vendidos' },
  ];

  public skeletonArray = computed(() => Array.from({ length: 12 }, (_, i) => i));

  // Pagination computed
  public canGoPrevious = computed(() => this.currentPage > 1);
  public canGoNext = computed(() => this.currentPage < this.totalPages);

  // Visible page numbers for pagination
  public visiblePages = computed(() => {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push(-1);
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push(-1);
      }

      pages.push(total);
    }

    return pages;
  });

  // View mode toggle
  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('productViewMode', mode);
      } catch (error) {
        console.warn('Failed to save view mode to localStorage:', error);
      }
    }
  }

  onSortChange(sortOption: ProductSortOption): void {
    this.selectedSort.set(sortOption);
    this.sortChange.emit(sortOption);
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
      this.scrollToTop();
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.canGoNext()) {
      this.goToPage(this.currentPage + 1);
    }
  }

  private scrollToTop(): void {
    const element = document.querySelector('.product-grid-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Product actions
  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }

  onToggleWishlist(product: Product): void {
    this.toggleWishlist.emit(product);
  }

  onQuickView(product: Product): void {
    this.quickView.emit(product);
  }

  onOpenFilters(): void {
    this.openFilters.emit();
  }

  // Load saved view mode
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedMode = localStorage.getItem('productViewMode') as ViewMode;
        if (savedMode === 'grid' || savedMode === 'list') {
          this.viewMode.set(savedMode);
        }
      } catch (error) {
        console.warn('Failed to load view mode from localStorage:', error);
      }
    }
  }
}
