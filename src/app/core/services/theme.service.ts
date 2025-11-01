/**
 * THEME SERVICE - Gerenciamento de Dark Mode
 *
 * Utiliza Angular Signals para gerenciamento reativo de estado.
 * Signals são a forma mais moderna de gerenciar estado no Angular 16+.
 *
 * POR QUÊ SIGNALS?
 * - Performance: Mudanças são rastreadas automaticamente e de forma granular
 * - Simplicidade: Menos boilerplate que RxJS para estado local
 * - Moderno: É o futuro do Angular (recomendação oficial)
 */

import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root' // Singleton - uma única instância para toda a aplicação
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  /**
   * Signal para o tema atual
   * Signals são valores reativos que notificam automaticamente quando mudam
   */
  public currentTheme = signal<Theme>(this.getInitialTheme());

  /**
   * Computed signal que determina se o dark mode está ativo
   * Signals computados são derivados de outros signals e atualizam automaticamente
   */
  public isDarkMode = signal<boolean>(this.getSystemPreference());

  constructor() {
    // Effect: executa automaticamente quando signals dependentes mudam
    // Similar ao useEffect do React, mas mais eficiente
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.applyTheme(this.currentTheme());
      }
    });

    // Listener para mudanças na preferência do sistema
    if (isPlatformBrowser(this.platformId)) {
      this.watchSystemPreference();
    }
  }

  /**
   * Obtém o tema inicial do localStorage ou preferência do sistema
   */
  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  }

  /**
   * Obtém a preferência do sistema operacional
   */
  private getSystemPreference(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Observa mudanças na preferência do sistema
   */
  private watchSystemPreference(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme() === 'system') {
        this.isDarkMode.set(e.matches);
        this.applyTheme('system');
      }
    });
  }

  /**
   * Aplica o tema ao documento
   *
   * ACESSIBILIDADE: Usa a classe 'dark' no elemento <html>
   * Isso permite que o TailwindCSS aplique estilos dark: automaticamente
   */
  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const htmlElement = document.documentElement;
    let shouldBeDark = false;

    if (theme === 'dark') {
      shouldBeDark = true;
    } else if (theme === 'system') {
      shouldBeDark = this.getSystemPreference();
    }

    this.isDarkMode.set(shouldBeDark);

    // Aplica/remove a classe 'dark'
    if (shouldBeDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Salva preferência no localStorage para persistência
    localStorage.setItem('theme', theme);

    // ACESSIBILIDADE: Define o color-scheme para melhor renderização nativa
    htmlElement.style.colorScheme = shouldBeDark ? 'dark' : 'light';
  }

  /**
   * Toggle entre light e dark
   * Método público para componentes usarem
   */
  public toggleTheme(): void {
    const currentIsDark = this.isDarkMode();
    const newTheme: Theme = currentIsDark ? 'light' : 'dark';
    this.currentTheme.set(newTheme);
  }

  /**
   * Define um tema específico
   */
  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Retorna se está em dark mode (read-only)
   */
  public get darkModeEnabled(): boolean {
    return this.isDarkMode();
  }
}
