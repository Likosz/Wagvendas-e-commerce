import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

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
})
export class Header {
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

  // Estado do menu mobile
  public mobileMenuOpen = signal(false);

  // Estado da busca mobile
  public searchOpen = signal(false);

  // Quantidade de itens no carrinho (mockado por enquanto)
  public cartItemCount = signal(3);

  public isScrolled = signal(false);

  public hasCartItems = computed(() => this.cartItemCount() > 0);

  public navLinks = [
    { label: 'Início', path: '/', exact: true },
    { label: 'Produtos', path: '/produtos' },
    { label: 'Ofertas', path: '/ofertas', badge: 'Novo' },
    { label: 'Categorias', path: '/categorias' },
    { label: 'Contato', path: '/contato' },
  ];

  constructor(public themeService: ThemeService) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled.set(scrollPosition > 20);
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
