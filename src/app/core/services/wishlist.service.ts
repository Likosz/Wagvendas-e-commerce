import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../interfaces/product.interface';

// Interface para item da wishlist
export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly STORAGE_KEY = 'wagsales_wishlist';

  // Signal privado para armazenar IDs dos produtos
  private wishlistIds = signal<Set<string>>(new Set());

  // Signal público computado para o contador
  public count = computed(() => this.wishlistIds().size);

  constructor() {
    this.loadFromStorage();

    effect(() => {
      this.saveToStorage();
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds().has(productId);
  }

  addToWishlist(productId: string): void {
    const currentIds = new Set(this.wishlistIds());
    currentIds.add(productId);
    this.wishlistIds.set(currentIds);
  }

  removeFromWishlist(productId: string): void {
    const currentIds = new Set(this.wishlistIds());
    currentIds.delete(productId);
    this.wishlistIds.set(currentIds);
  }

  toggleWishlist(productId: string): boolean {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
      return false;
    } else {
      this.addToWishlist(productId);
      return true;
    }
  }

  getWishlistIds(): string[] {
    return Array.from(this.wishlistIds());
  }

  clearWishlist(): void {
    this.wishlistIds.set(new Set());
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        this.wishlistIds.set(new Set(ids));
      }
    } catch (error) {
      console.warn('Erro ao carregar wishlist do localStorage:', error);
      this.wishlistIds.set(new Set());
    }
  }

  private saveToStorage(): void {
    try {
      const ids = Array.from(this.wishlistIds());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.warn('Erro ao salvar wishlist no localStorage:', error);
    }
  }
}
