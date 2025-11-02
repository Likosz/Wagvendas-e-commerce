import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Product } from '../../core/interfaces/product.interface';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ProductCard],
  templateUrl: './product.page.html',
  styleUrl: './product.page.scss',
})
export class ProductPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

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

  public isInWishlist = signal<boolean>(false);

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

  // Breadcrumbs
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

    // Adicionar modificadores de preço das variantes
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

  // Array de estrelas para rating
  public get starArray(): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      } else {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  private loadProduct(slug: string): void {
    this.loading.set(true);
    this.notFound.set(false);

    setTimeout(() => {
      const product = this.productService.getProductBySlug(slug);

      if (product) {
        this.product.set(product);
        this.loading.set(false);

        // Inicializar variantes selecionadas com primeira opção
        if (product.variants && product.variants.length > 0) {
          const variantsByType = new Map<string, string>();
          const types = new Set(product.variants.map((v) => v.type));

          types.forEach((type) => {
            const firstVariant = product.variants!.find((v) => v.type === type);
            if (firstVariant) {
              variantsByType.set(type, firstVariant.value);
            }
          });

          this.selectedVariants.set(variantsByType);
        }
      } else {
        this.notFound.set(true);
        this.loading.set(false);
      }
    }, 500);
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

    console.log('Adicionar ao carrinho:', {
      product: prod,
      quantity: this.quantity(),
      variants: Array.from(this.selectedVariants().entries()),
      finalPrice: this.finalPrice(),
    });

    // TODO: Implementar serviço de carrinho
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/carrinho']);
  }

  toggleWishlist(): void {
    this.isInWishlist.set(!this.isInWishlist());
    console.log('Wishlist toggled:', this.isInWishlist());
    // TODO: Implementar serviço de wishlist
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
        .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log('Link copiado!');
      // TODO: Mostrar toast
    }
  }

  // Mudar tab
  setActiveTab(tab: 'description' | 'specs' | 'reviews'): void {
    this.activeTab.set(tab);
  }

  // Tipo de estrela (cheia, meia, vazia)
  getStarType(index: number): 'full' | 'half' | 'empty' {
    const prod = this.product();
    if (!prod) return 'empty';

    const rating = prod.rating;
    if (index <= Math.floor(rating)) return 'full';
    if (index === Math.ceil(rating) && rating % 1 !== 0) return 'half';
    return 'empty';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
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
