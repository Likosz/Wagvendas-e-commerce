import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Hero } from './components/hero/hero';
import { CategoriesCarousel } from './components/categories-carousel/categories-carousel';
import { ProductFilters } from '../../shared/components/product-filters/product-filters';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { QuickViewModal } from '../../shared/components/quick-view-modal/quick-view-modal';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductFilter, ProductSortOption } from '../../core/interfaces/product.interface';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Hero,
    CategoriesCarousel,
    ProductFilters,
    QuickViewModal,
    ProductCard,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  public isFiltersOpen = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

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
    return this.productService.getCurrentPage();
  }

  public get totalPages() {
    return this.productService.totalPages();
  }

  // Seções compactas de produtos para a Home
  public get featured() {
    return this.productService.featuredProducts();
  }
  public get bestsellers() {
    return this.productService.bestsellerProducts();
  }
  public get news() {
    return this.productService.newProducts();
  }

  ngOnInit(): void {
    this.isLoading.set(false);
  }

  onFilterChange(filter: ProductFilter): void {
    this.isLoading.set(true);
    this.productService.filterProducts(filter);
    this.isLoading.set(false);
  }

  onSortChange(sortOption: ProductSortOption): void {
    this.isLoading.set(true);
    this.productService.sortProducts(sortOption);
    this.isLoading.set(false);
  }

  // Pagination
  onPageChange(page: number): void {
    this.isLoading.set(true);
    this.productService.setPage(page);
    this.isLoading.set(false);
  }

  onAddToCart(product: Product): void {
    this.cartService.add(product, 1);
  }

  onToggleWishlist(product: Product): void {
    return;
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
    this.cartService.add(data.product, data.quantity);
    this.closeQuickView();
  }

  // Mobile filters
  openFilters(): void {
    this.isFiltersOpen.set(true);
  }

  closeFilters(): void {
    this.isFiltersOpen.set(false);
  }
}
