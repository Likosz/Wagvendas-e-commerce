import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  X,
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  ExternalLink,
} from 'lucide-angular';
import { Product } from '../../../core/interfaces/product.interface';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-quick-view-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './quick-view-modal.html',
  styleUrl: './quick-view-modal.scss',
})
export class QuickViewModal {
  private wishlistService = inject(WishlistService);

  @Input() product: Product | null = null;
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();

  readonly icons = {
    X,
    Heart,
    ShoppingCart,
    Star,
    Plus,
    Minus,
    ExternalLink,
  };

  public selectedImageIndex = signal<number>(0);
  public quantity = signal<number>(1);

  public isInWishlist = computed(() => {
    if (!this.product) return false;
    return this.wishlistService.isInWishlist(this.product.id);
  });

  public selectedImage = computed(() => {
    if (!this.product) return '';
    const index = this.selectedImageIndex();
    return this.product.images?.[index] || this.product.thumbnail;
  });

  public starArray = computed(() => Array.from({ length: 5 }, (_, i) => i + 1));

  public availableStock = computed(() => {
    return this.product?.stock || 0;
  });

  onClose(): void {
    this.close.emit();
    this.resetState();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  increaseQuantity(): void {
    const max = this.availableStock();
    if (this.quantity() < max) {
      this.quantity.update((q) => q + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  onAddToCart(): void {
    if (!this.product) return;

    this.addToCart.emit({
      product: this.product,
      quantity: this.quantity(),
    });
  }

  toggleWishlist(): void {
    if (!this.product) return;
    this.wishlistService.toggleWishlist(this.product.id);
  }

  private resetState(): void {
    this.selectedImageIndex.set(0);
    this.quantity.set(1);
  }

  getStarType(index: number): 'full' | 'empty' {
    if (!this.product) return 'empty';
    const rating = this.product.rating;
    return index <= Math.floor(rating) ? 'full' : 'empty';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
