import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'WagSales - Sua loja online de confiança',
  },
  {
    path: 'produtos',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar página de produtos
    title: 'Produtos - WagSales',
  },
  {
    path: 'produto/:slug',
    loadComponent: () => import('./features/product/product.page').then((m) => m.ProductPage),
    title: 'Produto - WagSales',
  },
  {
    path: 'ofertas',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar página de ofertas
    title: 'Ofertas - WagSales',
  },
  {
    path: 'categorias',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar página de categorias
    title: 'Categorias - WagSales',
  },
  {
    path: 'contato',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar página de contato
    title: 'Contato - WagSales',
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar página de carrinho
    title: 'Carrinho - WagSales',
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar página de perfil
    title: 'Meu Perfil - WagSales',
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar página de favoritos
    title: 'Favoritos - WagSales',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
