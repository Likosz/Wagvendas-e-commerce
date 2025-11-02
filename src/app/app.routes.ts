import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'WagSales - Sua loja online',
  },
  {
    path: 'produtos',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar pagina de produtos
    title: 'Produtos - WagSales',
  },
  {
    path: 'produto/:slug',
    loadComponent: () => import('./features/product/product.page').then((m) => m.ProductPage),
    title: 'Produto - WagSales',
  },
  {
    path: 'ofertas',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar pagina de ofertas
    title: 'Ofertas - WagSales',
  },
  {
    path: 'categorias',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar pagina de categorias
    title: 'Categorias - WagSales',
  },
  {
    path: 'contato',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar pagina de contato
    title: 'Contato - WagSales',
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPage),
    title: 'Carrinho - WagSales',
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar pagina de perfil
    title: 'Meu Perfil - WagSales',
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./features/wishlist/wishlist.page').then((m) => m.WishlistPage),
    title: 'Favoritos - WagSales',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPage),
    title: 'Checkout - WagSales',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
