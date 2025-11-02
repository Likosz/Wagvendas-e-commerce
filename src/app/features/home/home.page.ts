import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { Hero } from './components/hero/hero';
import { CategoriesCarousel } from './components/categories-carousel/categories-carousel';
import { ProductGrid } from '../../shared/components/product-grid/product-grid';
import { ProductFilters } from '../../shared/components/product-filters/product-filters';
import { QuickViewModal } from '../../shared/components/quick-view-modal/quick-view-modal';

// Services
import { ProductService } from '../../core/services/product.service';
import { Product, ProductFilter, ProductSortOption } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, CategoriesCarousel, ProductGrid, ProductFilters, QuickViewModal],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  private productService = inject(ProductService);

  public isFiltersOpen = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

  // Quick View Modal
  public quickViewProduct = signal<Product | null>(null);
  public isQuickViewOpen = signal<boolean>(false);

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
    this.isLoading.set(false);
  }

  onFilterChange(filter: ProductFilter): void {
    this.isLoading.set(true);
    this.productService.filterProducts(filter);
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

  // Pagination
  onPageChange(page: number): void {
    this.isLoading.set(true);
    this.productService.setPage(page);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 300);
  }

  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    // TODO: Implement cart service
  }

  onToggleWishlist(product: Product): void {
    console.log('Toggle wishlist:', product);
    // TODO: Implement wishlist service
  }

  onQuickView(product: Product): void {
    this.quickViewProduct.set(product);
    this.isQuickViewOpen.set(true);
  }

  // Quick View Modal handlers
  closeQuickView(): void {
    this.isQuickViewOpen.set(false);
    setTimeout(() => {
      this.quickViewProduct.set(null);
    }, 300);
  }

  onQuickViewAddToCart(data: { product: Product; quantity: number }): void {
    console.log('Add to cart from quick view:', data);
    // TODO: Implementar serviço de carrinho
  }

  // Mobile filters
  openFilters(): void {
    this.isFiltersOpen.set(true);
  }

  closeFilters(): void {
    this.isFiltersOpen.set(false);
  }
}
