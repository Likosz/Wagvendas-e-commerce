import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGrid } from '../../shared/components/product-grid/product-grid';
import { ProductFilters } from '../../shared/components/product-filters/product-filters';
import { QuickViewModal } from '../../shared/components/quick-view-modal/quick-view-modal';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product, ProductFilter, ProductSortOption } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ProductGrid, ProductFilters, QuickViewModal],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private wishlist = inject(WishlistService);

  public isFiltersOpen = signal(false);
  public isLoading = signal(false);

  public quickViewProduct = signal<Product | null>(null);
  public isQuickViewOpen = signal(false);

  // proxies
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

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((qp) => {
      const cat = qp.get('cat');
      const sort = qp.get('sort') as any;
      const q = qp.get('q');

      if (cat) this.productService.filterProducts({ categories: [cat] });
      if (q) this.productService.searchProducts(q);
      if (sort) this.productService.sortProducts(sort);
    });
  }

  onFilterChange(filter: ProductFilter): void {
    this.isLoading.set(true);
    this.productService.filterProducts(filter);
    this.isLoading.set(false);
  }
  onSortChange(sort: ProductSortOption): void {
    this.isLoading.set(true);
    this.productService.sortProducts(sort);
    this.isLoading.set(false);
  }
  onPageChange(page: number): void {
    this.isLoading.set(true);
    this.productService.setPage(page);
    this.isLoading.set(false);
  }

  onAddToCart(product: Product): void {
    this.cartService.add(product, 1);
  }
  onToggleWishlist(product: Product): void {
    // ProductCard já faz o toggle
    return;
  }
  onQuickView(product: Product): void {
    this.quickViewProduct.set(product);
    this.isQuickViewOpen.set(true);
  }
  closeQuickView(): void {
    this.isQuickViewOpen.set(false);
    setTimeout(() => this.quickViewProduct.set(null), 300);
  }
  onQuickViewAddToCart(data: { product: Product; quantity: number }): void {
    this.cartService.add(data.product, data.quantity);
    this.closeQuickView();
  }

  openFilters(): void {
    this.isFiltersOpen.set(true);
  }
  closeFilters(): void {
    this.isFiltersOpen.set(false);
  }
}
