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

export type CouponType = 'percent' | 'fixed' | 'free_shipping';

export interface Coupon {
  code: string;
  type: CouponType;
  value?: number;
  minSubtotal?: number;
  expiresAt?: Date;
  description?: string;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'BEMVINDO10',
    type: 'percent',
    value: 10,
    minSubtotal: 100,
    description: '10% OFF acima de R$ 100',
  },
  {
    code: 'SAVE20',
    type: 'fixed',
    value: 20,
    minSubtotal: 150,
    description: 'R$ 20 OFF acima de R$ 150',
  },
  { code: 'FRETEGRATIS', type: 'free_shipping', description: 'Frete grátis em qualquer pedido' },
];

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'wagsales_cart_v1';
  private platformId = inject(PLATFORM_ID);
  private productService = inject(ProductService);

  private itemsMap = signal<Map<string, CartItemStored>>(new Map());
  private appliedCouponCode = signal<string | null>(null);
  public couponError = signal<string | null>(null);

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
    if (this.activeCoupon()?.type === 'free_shipping') return 0;
    return this.subtotal() >= 199 ? 0 : 19.9;
  });

  public activeCoupon = computed(() => {
    const code = this.appliedCouponCode();
    if (!code) return null;
    return AVAILABLE_COUPONS.find((c) => c.code.toLowerCase() === code.toLowerCase()) || null;
  });

  public discount = computed(() => {
    const coupon = this.activeCoupon();
    if (!coupon) return 0;
    const subtotal = this.subtotal();
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;
    if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) return 0;
    switch (coupon.type) {
      case 'percent':
        return Math.min(subtotal, Math.round(((coupon.value || 0) / 100) * subtotal));
      case 'fixed':
        return Math.min(subtotal, coupon.value || 0);
      case 'free_shipping':
        return 0;
      default:
        return 0;
    }
  });

  public total = computed(() => Math.max(0, this.subtotal() - this.discount() + this.shipping()));

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

  // Cupom
  public applyCoupon(code: string): boolean {
    this.couponError.set(null);
    const normalized = (code || '').trim().toLowerCase();
    if (!normalized) {
      this.appliedCouponCode.set(null);
      return false;
    }
    const coupon = AVAILABLE_COUPONS.find((c) => c.code.toLowerCase() === normalized);
    if (!coupon) {
      this.couponError.set('Cupom inválido.');
      return false;
    }
    if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
      this.couponError.set('Cupom expirado.');
      return false;
    }
    if (coupon.minSubtotal && this.subtotal() < coupon.minSubtotal) {
      this.couponError.set(`Válido acima de R$ ${coupon.minSubtotal.toFixed(2)}.`);
      return false;
    }
    this.appliedCouponCode.set(coupon.code);
    return true;
  }

  public removeCoupon(): void {
    this.appliedCouponCode.set(null);
    this.couponError.set(null);
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
      const parsed = JSON.parse(raw);
      const storedItems: CartItemStored[] = Array.isArray(parsed) ? parsed : parsed.items || [];
      const map = new Map<string, CartItemStored>();
      for (const it of storedItems) {
        map.set(this.makeKey(it.id, it.v), it);
      }
      this.itemsMap.set(map);
      const couponCode: string | null = Array.isArray(parsed) ? null : parsed.coupon || null;
      this.appliedCouponCode.set(couponCode);
    } catch {}
  }

  private saveToStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const arr = Array.from(this.itemsMap().values());
      const payload = { items: arr, coupon: this.appliedCouponCode() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }
}
