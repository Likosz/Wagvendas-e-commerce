import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Trash2, Plus, Minus } from 'lucide-angular';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
})
export class CartPage {
  private cart = inject(CartService);

  readonly icons = { ShoppingCart, Trash2, Plus, Minus };

  public entries = this.cart.entries;
  public count = this.cart.count;
  public subtotal = this.cart.subtotal;
  public shipping = this.cart.shipping;
  public total = this.cart.total;

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
}
