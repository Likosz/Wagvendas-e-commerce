import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Heart,
  ShoppingCart,
  Star,
  Eye,
  TrendingUp,
  Truck,
} from 'lucide-angular';
import { Product } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() product?: Product;
  @Input() loading: boolean = false;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();
  @Output() quickView = new EventEmitter<Product>();

  readonly icons = {
    Heart,
    ShoppingCart,
    Star,
    Eye,
    TrendingUp,
    Truck,
  };

  public isInWishlist = signal<boolean>(false);
  public isAddingToCart = signal<boolean>(false);

  // Gera array de estrelas para rating
  getStarArray(): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  // Retorna se a estrela está preenchida, meia ou vazia
  getStarType(index: number): 'full' | 'half' | 'empty' {
    if (!this.product) return 'empty';
    const rating = this.product.rating;
    if (index <= Math.floor(rating)) return 'full';
    if (index === Math.ceil(rating) && rating % 1 !== 0) return 'half';
    return 'empty';
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.product) return;

    this.isAddingToCart.set(true);
    this.addToCart.emit(this.product);

    setTimeout(() => {
      this.isAddingToCart.set(false);
    }, 800);
  }

  onToggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.product) return;

    this.isInWishlist.set(!this.isInWishlist());
    this.toggleWishlist.emit(this.product);
  }

  onQuickView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.product) return;

    this.quickView.emit(this.product);
  }

  // Calcula porcentagem de desconto
  getDiscountPercentage(): number {
    if (!this.product || !this.product.originalPrice) return 0;
    return Math.round(
      ((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100,
    );
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
