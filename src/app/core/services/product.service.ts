import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductFilter, ProductSortOption } from '../interfaces/product.interface';
import { PRODUCTS_MOCK } from '../data/products.data';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Estado reativo
  private allProducts = signal<Product[]>(PRODUCTS_MOCK);
  private filteredProducts = signal<Product[]>(PRODUCTS_MOCK);
  private currentFilter = signal<ProductFilter>({});
  private currentSort = signal<ProductSortOption>(ProductSortOption.RELEVANCE);
  private searchQuery = signal<string>('');

  // Paginação
  private currentPage = signal<number>(1);
  private itemsPerPage = signal<number>(12);

  // Computed Signals
  public products = computed(() => this.filteredProducts());
  public totalProducts = computed(() => this.filteredProducts().length);
  public totalPages = computed(() => Math.ceil(this.totalProducts() / this.itemsPerPage()));
  public paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredProducts().slice(start, end);
  });

  // Featured & Bestsellers
  public featuredProducts = computed(() =>
    this.allProducts()
      .filter((p) => p.featured)
      .slice(0, 8),
  );
  public bestsellerProducts = computed(() =>
    this.allProducts()
      .filter((p) => p.bestseller)
      .slice(0, 8),
  );
  public newProducts = computed(() =>
    this.allProducts()
      .filter((p) => p.isNew)
      .slice(0, 8),
  );

  constructor() {
    this.loadProducts();
  }

  public getCurrentPage(): number {
    return this.currentPage();
  }

  public getItemsPerPage(): number {
    return this.itemsPerPage();
  }

  public getAllProducts(): Product[] {
    return this.allProducts();
  }

  private loadProducts(): void {
    this.allProducts.set(PRODUCTS_MOCK);
    this.filteredProducts.set(PRODUCTS_MOCK);
  }

  public searchProducts(query: string): void {
    this.searchQuery.set(query.toLowerCase().trim());
    this.applyFilters();
  }

  public filterProducts(filter: ProductFilter): void {
    this.currentFilter.set(filter);
    this.applyFilters();
  }

  public sortProducts(sortOption: ProductSortOption): void {
    this.currentSort.set(sortOption);
    this.applySorting();
  }

  public setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  public resetFilters(): void {
    this.currentFilter.set({});
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.filteredProducts.set(this.allProducts());
  }

  public getProductById(id: string): Product | undefined {
    return this.allProducts().find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.allProducts().find((p) => p.slug === slug);
  }

  public getRelatedProducts(productId: string, limit: number = 4): Product[] {
    const product = this.getProductById(productId);
    if (!product) return [];

    return this.allProducts()
      .filter((p) => p.category === product.category && p.id !== productId)
      .slice(0, limit);
  }

  public getProductsByCategory(categorySlug: string): Product[] {
    return this.allProducts().filter((p) => p.category === categorySlug);
  }

  private applyFilters(): void {
    let filtered = [...this.allProducts()];

    // Busca por texto
    const query = this.searchQuery();
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.shortDescription?.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          p.brand.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query),
      );
    }

    // Filtros
    const filter = this.currentFilter();

    if (filter.categories && filter.categories.length > 0) {
      filtered = filtered.filter((p) => filter.categories!.includes(p.category));
    }

    if (filter.priceRange) {
      filtered = filtered.filter(
        (p) => p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max,
      );
    }

    if (filter.brands && filter.brands.length > 0) {
      filtered = filtered.filter((p) => filter.brands!.includes(p.brand));
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((p) => filter.tags!.some((tag) => p.tags.includes(tag)));
    }

    if (filter.rating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= filter.rating!);
    }

    if (filter.inStock === true) {
      filtered = filtered.filter((p) => p.inStock);
    }

    if (filter.freeShipping === true) {
      filtered = filtered.filter((p) => p.freeShipping);
    }

    if (filter.featured === true) {
      filtered = filtered.filter((p) => p.featured);
    }

    if (filter.isNew === true) {
      filtered = filtered.filter((p) => p.isNew);
    }

    this.filteredProducts.set(filtered);
    this.applySorting();
    this.currentPage.set(1);
  }

  private applySorting(): void {
    const sortOption = this.currentSort();
    let sorted = [...this.filteredProducts()];

    switch (sortOption) {
      case ProductSortOption.PRICE_LOW_HIGH:
        sorted.sort((a, b) => a.price - b.price);
        break;

      case ProductSortOption.PRICE_HIGH_LOW:
        sorted.sort((a, b) => b.price - a.price);
        break;

      case ProductSortOption.NAME_A_Z:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case ProductSortOption.NAME_Z_A:
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case ProductSortOption.RATING:
        sorted.sort((a, b) => b.rating - a.rating);
        break;

      case ProductSortOption.NEWEST:
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;

      case ProductSortOption.BESTSELLER:
        sorted.sort((a, b) => {
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return b.reviewCount - a.reviewCount;
        });
        break;

      case ProductSortOption.RELEVANCE:
      default:
        // Relevância: featured > bestseller > rating > reviewCount
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          if (a.rating !== b.rating) return b.rating - a.rating;
          return b.reviewCount - a.reviewCount;
        });
        break;
    }

    this.filteredProducts.set(sorted);
  }

  public getStats() {
    return {
      total: this.allProducts().length,
      featured: this.featuredProducts().length,
      bestsellers: this.bestsellerProducts().length,
      new: this.newProducts().length,
      inStock: this.allProducts().filter((p) => p.inStock).length,
      categories: new Set(this.allProducts().map((p) => p.category)).size,
      brands: new Set(this.allProducts().map((p) => p.brand)).size,
    };
  }

  public getUniqueBrands(): string[] {
    return Array.from(new Set(this.allProducts().map((p) => p.brand))).sort();
  }

  public getPriceRange(): { min: number; max: number } {
    const prices = this.allProducts().map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  public getUniqueTags(): string[] {
    const tags = this.allProducts().flatMap((p) => p.tags);
    return Array.from(new Set(tags)).sort();
  }
}
