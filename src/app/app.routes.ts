import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'WagVendas - Sua loja online',
  },
  {
    path: 'produtos',
    loadComponent: () => import('./features/products/products.page').then((m) => m.ProductsPage),
    title: 'Produtos - WagVendas',
  },
  {
    path: 'produto/:slug',
    loadComponent: () => import('./features/product/product.page').then((m) => m.ProductPage),
    title: 'Produto - WagVendas',
  },
  {
    path: 'ofertas',
    loadComponent: () => import('./features/offers/offers.page').then((m) => m.OffersPage),
    title: 'Ofertas - WagVendas',
  },
  {
    path: 'contato',
    redirectTo: '',
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPage),
    title: 'Carrinho - WagVendas',
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage), // TODO: Criar pagina de perfil
    title: 'Meu Perfil - WagVendas',
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./features/wishlist/wishlist.page').then((m) => m.WishlistPage),
    title: 'Favoritos - WagVendas',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPage),
    title: 'Checkout - WagVendas',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

