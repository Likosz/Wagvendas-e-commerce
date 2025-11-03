import {
  Component,
  signal,
  computed,
  HostListener,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

import {
  LucideAngularModule,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Heart,
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private wishlistService = inject(WishlistService);
  public cart = inject(CartService);

  readonly icons = {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    Sun,
    Moon,
    Heart,
  };

  public mobileMenuOpen = signal(false);

  public searchOpen = signal(false);

  // Quantidade de itens no carrinho
  public cartItemCount = computed(() => this.cart.count());

  public wishlistCount = computed(() => this.wishlistService.count());

  public isScrolled = signal(false);

  public hasCartItems = computed(() => this.cartItemCount() > 0);

  public hasWishlistItems = computed(() => this.wishlistCount() > 0);

  public navLinks = [
    { label: 'Inicio', path: '/', exact: true },
    { label: 'Produtos', path: '/produtos' },
    { label: 'Ofertas', path: '/ofertas', badge: 'Novo' },
  ];

  constructor(public themeService: ThemeService) {}

  private scrollTicking = false;
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      this.isScrolled.set(scrollPosition > 20);
      this.scrollTicking = false;
    });
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);

    if (this.mobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  public toggleSearch(): void {
    this.searchOpen.update((value) => !value);
  }

  // Mini-cart
  public miniCartOpen = signal(false);

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.miniCartOpen()) this.miniCartOpen.set(false);
  }

  public toggleMiniCart(): void {
    this.miniCartOpen.update((v) => !v);
  }

  public closeMiniCart(): void {
    this.miniCartOpen.set(false);
  }

  public formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  public toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Handler da busca
   * TODO: Implementar lógica de busca real
   */
  public onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value;

    if (searchTerm.trim()) {
      console.log('Buscando por:', searchTerm);
      // TODO: Implementar navegação para página de resultados
    }
  }

  public onMenuClick(event: Event): void {
    event.stopPropagation();
  }
}



