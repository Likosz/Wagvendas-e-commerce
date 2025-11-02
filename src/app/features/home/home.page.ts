import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { Hero } from './components/hero/hero';
import { CategoriesCarousel } from './components/categories-carousel/categories-carousel';
import { ProductGrid } from '../../shared/components/product-grid/product-grid';
import { ProductFilters } from '../../shared/components/product-filters/product-filters';

// Services
import { ProductService } from '../../core/services/product.service';
import { Product, ProductFilter, ProductSortOption } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, CategoriesCarousel, ProductGrid, ProductFilters],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  private productService = inject(ProductService);

  // UI State
  public isFiltersOpen = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

  // Product data from service (using computed signals)
  public get paginatedProducts() {
    return this.productService.paginatedProducts();
  }

  public get totalProducts() {
    return this.productService.totalProducts();
  }

  public get currentPage() {
    return this.productService['currentPage']();
  }

  public get totalPages() {
    return this.productService.totalPages();
  }

  ngOnInit(): void {
    // Initial load is already done by ProductService
    // Just mark as loaded
    this.isLoading.set(false);
  }

  // Filter handlers
  onFilterChange(filter: ProductFilter): void {
    this.isLoading.set(true);
    this.productService.filterProducts(filter);
    // Simulate network delay for better UX
    setTimeout(() => {
      this.isLoading.set(false);
    }, 300);
  }

  // Sort handler
  onSortChange(sortOption: ProductSortOption): void {
    this.isLoading.set(true);
    this.productService.sortProducts(sortOption);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 300);
  }

  // Pagination handler
  onPageChange(page: number): void {
    this.isLoading.set(true);
    this.productService.setPage(page);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 300);
  }

  // Product actions
  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    // TODO: Implement cart service
  }

  onToggleWishlist(product: Product): void {
    console.log('Toggle wishlist:', product);
    // TODO: Implement wishlist service
  }

  onQuickView(product: Product): void {
    console.log('Quick view:', product);
    // TODO: Implement quick view modal
  }

  // Mobile filters
  openFilters(): void {
    this.isFiltersOpen.set(true);
  }

  closeFilters(): void {
    this.isFiltersOpen.set(false);
  }
}
