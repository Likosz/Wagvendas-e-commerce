import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Heart, ShoppingBag, Trash2 } from 'lucide-angular';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductService } from '../../core/services/product.service';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ProductCard],
  templateUrl: './wishlist.page.html',
  styleUrl: './wishlist.page.scss',
})
export class WishlistPage {
  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);

  readonly icons = {
    Heart,
    ShoppingBag,
    Trash2,
  };

  // Produtos da wishlist
  public wishlistProducts = computed(() => {
    const wishlistIds = this.wishlistService.getWishlistIds();
    return this.productService
      .getAllProducts()
      .filter((product: Product) => wishlistIds.includes(product.id));
  });

  // Contador de produtos
  public count = computed(() => this.wishlistProducts().length);

  // Total da wishlist (soma dos preços)
  public totalPrice = computed(() => {
    return this.wishlistProducts().reduce((total: number, product: Product) => total + product.price, 0);
  });

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id);
  }

  addAllToCart(): void {
    // TODO: Implementar quando o serviço de carrinho estiver pronto
    console.log('Adicionar todos ao carrinho:', this.wishlistProducts());
  }

  clearWishlist(): void {
    if (confirm('Tem certeza que deseja remover todos os produtos dos favoritos?')) {
      this.wishlistService.clearWishlist();
    }
  }

  onAddToCart(product: Product): void {
    // TODO: Implementar serviço de carrinho
    console.log('Adicionar ao carrinho:', product);
  }

  onToggleWishlist(product: Product): void {
    this.wishlistService.toggleWishlist(product.id);
  }

  onQuickView(product: Product): void {
    // TODO: Implementar quick view modal
    console.log('Quick view:', product);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
