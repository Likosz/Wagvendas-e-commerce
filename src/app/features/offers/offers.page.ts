import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGrid } from '../../shared/components/product-grid/product-grid';
import { QuickViewModal } from '../../shared/components/quick-view-modal/quick-view-modal';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/interfaces/product.interface';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-offers-page',
  standalone: true,
  imports: [CommonModule, ProductGrid, QuickViewModal],
  templateUrl: './offers.page.html',
  styleUrl: './offers.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersPage implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlist = inject(WishlistService);

  public isLoading = signal(false);
  public quickViewProduct = signal<Product | null>(null);
  public isQuickViewOpen = signal(false);

  // dados calculados
  private get discounted(): Product[] {
    return this.productService.getAllProducts().filter((p) => (p.discount || 0) > 0);
  }
  public page = signal(1);
  public perPage = 12;

  public get totalProducts() {
    return this.discounted.length;
  }
  public get totalPages() {
    return Math.max(1, Math.ceil(this.totalProducts / this.perPage));
  }
  public get paginatedProducts() {
    const start = (this.page() - 1) * this.perPage;
    return this.discounted.slice(start, start + this.perPage);
  }
  public get currentPage() {
    return this.page();
  }

  ngOnInit(): void {}

  onPageChange(p: number): void {
    if (p >= 1 && p <= this.totalPages) this.page.set(p);
  }
  onSortChange(_: any): void {}

  onAddToCart(p: Product): void {
    this.cartService.add(p, 1);
  }
  onToggleWishlist(p: Product): void {
    // O componente ProductCard já realiza o toggle
    return;
  }
  onQuickView(p: Product): void {
    this.quickViewProduct.set(p);
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
}
