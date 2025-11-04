import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
} from 'lucide-angular';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/interfaces/product.interface';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ProductCard],
  templateUrl: './product.page.html',
  styleUrl: './product.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private platformId = inject(PLATFORM_ID);

  readonly icons = {
    Heart,
    Share2,
    Truck,
    ShieldCheck,
    RotateCcw,
    Star,
  };

  public product = signal<Product | undefined>(undefined);
  public loading = signal<boolean>(true);
  public notFound = signal<boolean>(false);

  public prod = computed(() => this.product()!);

  public selectedImageIndex = signal<number>(0);
  public isImageZoomed = signal<boolean>(false);

  public selectedVariants = signal<Map<string, string>>(new Map());

  public quantity = signal<number>(1);

  public isInWishlist = computed(() => {
    const prod = this.product();
    if (!prod) return false;
    return this.wishlistService.isInWishlist(prod.id);
  });

  public activeTab = signal<'description' | 'specs' | 'reviews'>('description');

  public relatedProducts = computed(() => {
    const prod = this.product();
    if (!prod) return [];
    return this.productService.getRelatedProducts(prod.id, 4);
  });

  public selectedImage = computed(() => {
    const prod = this.product();
    const index = this.selectedImageIndex();
    return prod?.images[index] || prod?.thumbnail || '';
  });

  // Avaliação do usuário
  public userRating = signal<number>(0);
  public hoverRating = signal<number>(0);

  private loadUserRating(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prod = this.product();
    if (!prod) return;
    try {
      const key = `wag:rating:${prod.id}`;
      const v = localStorage.getItem(key);
      if (v) this.userRating.set(Math.max(0, Math.min(5, parseInt(v, 10) || 0)));
    } catch {}
  }

  private saveUserRating(value: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prod = this.product();
    if (!prod) return;
    try {
      const key = `wag:rating:${prod.id}`;
      localStorage.setItem(key, String(value));
    } catch {}
  }

  private removeUserRating(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prod = this.product();
    if (!prod) return;
    try {
      const key = `wag:rating:${prod.id}`;
      localStorage.removeItem(key);
    } catch {}
  }

  public breadcrumbs = computed(() => {
    const prod = this.product();
    if (!prod) return [];
    return [
      { label: 'Home', url: '/' },
      { label: prod.categoryName, url: '/', query: { categoria: prod.category } },
      { label: prod.name, url: null },
    ];
  });

  // Preço com desconto
  public finalPrice = computed(() => {
    const prod = this.product();
    if (!prod) return 0;
    let price = prod.price;
    const variants = prod.variants || [];
    this.selectedVariants().forEach((variantValue, variantType) => {
      const variant = variants.find((v) => v.type === variantType && v.value === variantValue);
      if (variant?.priceModifier) {
        price += variant.priceModifier;
      }
    });
    return price;
  });

  // Estoque disponível
  public availableStock = computed(() => {
    const prod = this.product();
    if (!prod) return 0;
    let stock = prod.stock;
    const variants = prod.variants || [];
    this.selectedVariants().forEach((variantValue, variantType) => {
      const variant = variants.find((v) => v.type === variantType && v.value === variantValue);
      if (variant?.stockModifier) {
        stock += variant.stockModifier;
      }
    });
    return Math.max(0, stock);
  });

  // Total considerando a quantidade
  public totalPrice = computed(() => {
    const qty = this.quantity();
    const unit = this.finalPrice();
    return Math.max(0, unit * (qty || 0));
  });

  // Array de estrelas para rating
  public get starArray(): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch {}
    }

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.notFound.set(true);
        this.loading.set(false);
        return;
      }
      const product = this.productService.getProductBySlug(slug);
      if (product) {
        this.product.set(product);
        this.loading.set(false);
        this.loadUserRating();
      } else {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  toggleZoom(): void {
    this.isImageZoomed.set(!this.isImageZoomed());
  }

  selectVariant(type: string, value: string): void {
    const variants = new Map(this.selectedVariants());
    variants.set(type, value);
    this.selectedVariants.set(variants);
  }

  isVariantSelected(type: string, value: string): boolean {
    return this.selectedVariants().get(type) === value;
  }

  increaseQuantity(): void {
    const max = this.availableStock();
    if (this.quantity() < max) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  addToCart(): void {
    const prod = this.product();
    if (!prod) return;
    const variantSelections: Record<string, string> = {};
    this.selectedVariants().forEach((value, key) => (variantSelections[key] = value));
    this.cartService.add(prod, this.quantity(), variantSelections);
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/carrinho']);
  }

  toggleWishlist(): void {
    const prod = this.product();
    if (!prod) return;
    this.wishlistService.toggleWishlist(prod.id);
  }

  share(): void {
    const prod = this.product();
    if (!prod) return;
    if (navigator.share) {
      navigator
        .share({
          title: prod.name,
          text: prod.shortDescription || prod.description,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  setActiveTab(tab: 'description' | 'specs' | 'reviews'): void {
    this.activeTab.set(tab);
  }

  // Tipo de estrela
  getStarType(index: number): 'full' | 'half' | 'empty' {
    const prod = this.product();
    if (!prod) return 'empty';
    const rating = prod.rating;
    if (index <= Math.floor(rating)) return 'full';
    if (index === Math.ceil(rating) && rating % 1 !== 0) return 'half';
    return 'empty';
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  onStarEnter(value: number): void {
    this.hoverRating.set(value);
  }

  onStarLeave(): void {
    this.hoverRating.set(0);
  }

  onStarSelect(value: number): void {
    if (this.userRating() === value) {
      this.userRating.set(0);
      this.removeUserRating();
      return;
    }

    const v = Math.max(1, Math.min(5, value));
    this.userRating.set(v);
    this.saveUserRating(v);
  }

  onStarKeydown(event: KeyboardEvent, value: number): void {
    const key = event.key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.onStarSelect(value);
      return;
    }
    if (key === 'ArrowRight' || key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(5, (this.userRating() || 0) + 1);
      this.onStarSelect(next);
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowDown') {
      event.preventDefault();
      const prev = Math.max(1, (this.userRating() || 1) - 1);
      this.onStarSelect(prev);
      return;
    }
  }

  isUserStarActive(index: number): boolean {
    if (this.hoverRating() > 0) {
      return index <= this.hoverRating();
    }

    return this.userRating() > 0 && index <= this.userRating();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  getVariantTypes(): string[] {
    const prod = this.product();
    if (!prod?.variants) return [];
    return Array.from(new Set(prod.variants.map((v) => v.type)));
  }

  getVariantsByType(type: string): any[] {
    const prod = this.product();
    if (!prod?.variants) return [];
    return prod.variants.filter((v) => v.type === type);
  }

  translateVariantType(type: string): string {
    const translations: Record<string, string> = {
      color: 'Cor',
      size: 'Tamanho',
      material: 'Material',
      other: 'Outro',
    };
    return translations[type] || type;
  }
}
