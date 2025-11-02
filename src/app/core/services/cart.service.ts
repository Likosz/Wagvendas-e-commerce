import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../interfaces/product.interface';
import { ProductService } from './product.service';

export interface CartItemStored {
  id: string;
  qty: number;
  v?: Record<string, string>;
}

export interface DetailedCartItem {
  key: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
  variantSelections?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'wagsales_cart_v1';
  private platformId = inject(PLATFORM_ID);
  private productService = inject(ProductService);

  private itemsMap = signal<Map<string, CartItemStored>>(new Map());

  public entries = computed<DetailedCartItem[]>(() => {
    const products = this.productService.getAllProducts();
    const list: DetailedCartItem[] = [];

    for (const [key, it] of this.itemsMap().entries()) {
      const product = products.find((p) => p.id === it.id);
      if (!product) continue;

      let unitPrice = product.price;
      if (it.v && product.variants?.length) {
        for (const [type, value] of Object.entries(it.v)) {
          const variant = product.variants.find((v) => v.type === type && v.value === value);
          if (variant?.priceModifier) unitPrice += variant.priceModifier;
        }
      }

      list.push({
        key,
        product,
        quantity: it.qty,
        unitPrice,
        total: unitPrice * it.qty,
        variantSelections: it.v,
      });
    }

    return list;
  });

  public count = computed(() =>
    Array.from(this.itemsMap().values()).reduce((acc, it) => acc + it.qty, 0),
  );

  public subtotal = computed(() => this.entries().reduce((s, e) => s + e.total, 0));

  public shipping = computed(() => {
    if (this.count() === 0) return 0;
    return this.subtotal() >= 199 ? 0 : 19.9;
  });

  public total = computed(() => this.subtotal() + this.shipping());

  constructor() {
    this.loadFromStorage();
    effect(() => {
      this.saveToStorage();
    });
  }

  add(product: Product, quantity = 1, variantSelections?: Record<string, string>) {
    const key = this.makeKey(product.id, variantSelections);
    const map = new Map(this.itemsMap());

    const current = map.get(key);
    const requested = (current?.qty ?? 0) + Math.max(1, quantity);

    // Clamp baseado em estoque e variantes
    let maxStock = product.stock;
    if (variantSelections && product.variants?.length) {
      for (const [type, value] of Object.entries(variantSelections)) {
        const variant = product.variants.find((v) => v.type === type && v.value === value);
        if (variant?.stockModifier) maxStock += variant.stockModifier;
      }
    }

    const clamped = Math.max(0, Math.min(requested, Math.max(0, maxStock)));
    map.set(key, { id: product.id, qty: clamped, v: variantSelections });

    this.itemsMap.set(map);
  }

  remove(key: string) {
    const map = new Map(this.itemsMap());
    map.delete(key);
    this.itemsMap.set(map);
  }

  updateQuantity(key: string, quantity: number) {
    const map = new Map(this.itemsMap());
    if (!map.has(key)) return;
    if (quantity <= 0) {
      map.delete(key);
    } else {
      const it = map.get(key)!;
      // tentar clamp com base no produto real
      const product = this.productService.getProductById(it.id);
      let maxStock = product?.stock ?? quantity;
      if (product && it.v && product.variants?.length) {
        for (const [type, value] of Object.entries(it.v)) {
          const variant = product.variants.find((v) => v.type === type && v.value === value);
          if (variant?.stockModifier) maxStock += variant.stockModifier;
        }
      }
      const clamped = Math.max(0, Math.min(quantity, Math.max(0, maxStock)));
      map.set(key, { ...it, qty: clamped });
    }
    this.itemsMap.set(map);
  }

  clear() {
    this.itemsMap.set(new Map());
  }

  private makeKey(productId: string, v?: Record<string, string>) {
    if (!v || Object.keys(v).length === 0) return productId;
    const suffix = Object.entries(v)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, val]) => `${k}=${val}`)
      .join('|');
    return `${productId}:${suffix}`;
  }

  private loadFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw) as CartItemStored[];
      const map = new Map<string, CartItemStored>();
      for (const it of arr) {
        map.set(this.makeKey(it.id, it.v), it);
      }
      this.itemsMap.set(map);
    } catch {}
  }

  private saveToStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const arr = Array.from(this.itemsMap().values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(arr));
    } catch {}
  }
}
