import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Trash2, Plus, Minus } from 'lucide-angular';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  private route = inject(ActivatedRoute);
  private cart = inject(CartService);

  readonly icons = { ShoppingCart, Trash2, Plus, Minus };
  public couponInput = signal<string>('');

  public entries = this.cart.entries;
  public count = this.cart.count;
  public subtotal = this.cart.subtotal;
  public shipping = this.cart.shipping;
  public discount = this.cart.discount;
  public total = this.cart.total;
  public activeCoupon = this.cart.activeCoupon;
  public couponError = this.cart.couponError;

  public shippingLabel = computed(() => {
    const ship = this.shipping();
    const coupon = this.activeCoupon();
    if (ship === 0 && coupon?.type === 'free_shipping') return 'Grátis (cupom)';
    if (ship === 0) return 'Grátis';
    return this.formatPrice(ship);
  });

  // Helper para iterar chaves de objetos no template
  public keys(obj?: Record<string, string> | null): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  increase(key: string, current: number) {
    this.cart.updateQuantity(key, current + 1);
  }

  decrease(key: string, current: number) {
    this.cart.updateQuantity(key, Math.max(0, current - 1));
  }

  remove(key: string) {
    this.cart.remove(key);
  }

  clear() {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      this.cart.clear();
    }
  }

  applyCoupon(): void {
    const ok = this.cart.applyCoupon(this.couponInput());
    if (ok) {
      // normalizar caixa do input com o código aplicado
      this.couponInput.set(this.activeCoupon()?.code || '');
    }
  }

  removeCoupon(): void {
    this.cart.removeCoupon();
    this.couponInput.set('');
  }

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    const code = qp.get('cupom') || qp.get('coupon') || '';
    if (code) {
      this.couponInput.set(code.toUpperCase());
      this.applyCoupon();
    }
    // Se já houver cupom aplicado, refletir no input ao entrar na página
    const active = this.activeCoupon();
    if (active && !code) {
      this.couponInput.set(active.code.toUpperCase());
    }
  }
}
