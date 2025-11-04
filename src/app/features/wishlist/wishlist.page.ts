import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { LucideAngularModule, Heart, ShoppingBag, Trash2 } from 'lucide-angular';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductService } from '../../core/services/product.service';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { QuickViewModal } from '../../shared/components/quick-view-modal/quick-view-modal';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ProductCard, QuickViewModal],
  templateUrl: './wishlist.page.html',
  styleUrl: './wishlist.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistPage {
  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);
  private cart = inject(CartService);

  readonly icons = {
    Heart,
    ShoppingBag,
    Trash2,
  };

  public quickViewProduct = signal<Product | null>(null);
  public isQuickViewOpen = signal<boolean>(false);

  public wishlistProducts = computed(() => {
    const wishlistIds = this.wishlistService.getWishlistIds();
    return this.productService
      .getAllProducts()
      .filter((product: Product) => wishlistIds.includes(product.id));
  });

  public count = computed(() => this.wishlistProducts().length);

  public totalPrice = computed(() => {
    return this.wishlistProducts().reduce(
      (total: number, product: Product) => total + product.price,
      0,
    );
  });

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id);
  }

  addAllToCart(): void {
    const items = this.wishlistProducts();
    items.forEach((p) => this.cart.add(p, 1));
  }

  clearWishlist(): void {
    if (confirm('Tem certeza que deseja remover todos os produtos dos favoritos?')) {
      this.wishlistService.clearWishlist();
    }
  }

  onAddToCart(product: Product): void {
    this.cart.add(product, 1);
  }

  onToggleWishlist(product: Product): void {
    this.wishlistService.toggleWishlist(product.id);
  }

  onQuickView(product: Product): void {
    this.quickViewProduct.set(product);
    this.isQuickViewOpen.set(true);
  }

  // Quick View Modal
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
