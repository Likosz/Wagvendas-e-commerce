import { Component, Output, EventEmitter, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  X,
  Filter,
  Star,
  Package,
  Truck,
  SlidersHorizontal,
} from 'lucide-angular';
import { ProductFilter } from '../../../core/interfaces/product.interface';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.scss',
})
export class ProductFilters implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  @Output() filterChange = new EventEmitter<ProductFilter>();
  @Output() closeDrawer = new EventEmitter<void>();

  readonly icons = {
    X,
    Filter,
    Star,
    Package,
    Truck,
    SlidersHorizontal,
  };

  // Filter state
  public selectedCategories = signal<string[]>([]);
  public selectedBrands = signal<string[]>([]);
  public selectedTags = signal<string[]>([]);
  public minPrice = signal<number>(0);
  public maxPrice = signal<number>(10000);
  public selectedRating = signal<number>(0);
  public inStockOnly = signal<boolean>(false);
  public freeShippingOnly = signal<boolean>(false);

  // Filter options
  public categoryOptions = signal<FilterOption[]>([]);
  public brandOptions = signal<FilterOption[]>([]);
  public tagOptions = signal<FilterOption[]>([]);
  public priceRange = signal<{ min: number; max: number }>({ min: 0, max: 10000 });

  public hasActiveFilters = computed(() => {
    return (
      this.selectedCategories().length > 0 ||
      this.selectedBrands().length > 0 ||
      this.selectedTags().length > 0 ||
      this.selectedRating() > 0 ||
      this.inStockOnly() ||
      this.freeShippingOnly() ||
      this.minPrice() > this.priceRange().min ||
      this.maxPrice() < this.priceRange().max
    );
  });

  public activeFilterCount = computed(() => {
    let count = 0;
    count += this.selectedCategories().length;
    count += this.selectedBrands().length;
    count += this.selectedTags().length;
    if (this.selectedRating() > 0) count++;
    if (this.inStockOnly()) count++;
    if (this.freeShippingOnly()) count++;
    if (this.minPrice() > this.priceRange().min || this.maxPrice() < this.priceRange().max) count++;
    return count;
  });

  ngOnInit(): void {
    this.loadFilterOptions();
    const cat = this.route.snapshot.queryParamMap.get('cat');
    if (cat) {
      this.applyCategoryFromQuery(cat);
    }
    this.route.queryParamMap.subscribe((map) => {
      const c = map.get('cat');
      if (c) this.applyCategoryFromQuery(c);
    });
  }

  private loadFilterOptions(): void {
    const categories = [
      { id: '1', label: 'Eletrônicos', count: 8, checked: false },
      { id: '2', label: 'Moda', count: 7, checked: false },
      { id: '3', label: 'Casa & Decoração', count: 5, checked: false },
      { id: '4', label: 'Esportes', count: 5, checked: false },
      { id: '5', label: 'Beleza', count: 3, checked: false },
      { id: '6', label: 'Livros', count: 2, checked: false },
    ];
    this.categoryOptions.set(categories);

    const brands = this.productService.getUniqueBrands().map((brand) => ({
      id: brand.toLowerCase(),
      label: brand,
      checked: false,
    }));
    this.brandOptions.set(brands);

    const tags = this.productService
      .getUniqueTags()
      .slice(0, 10)
      .map((tag) => ({
        id: tag.toLowerCase(),
        label: tag,
        checked: false,
      }));
    this.tagOptions.set(tags);

    const range = this.productService.getPriceRange();
    this.priceRange.set(range);
    this.minPrice.set(range.min);
    this.maxPrice.set(range.max);
  }

  // Marca checkbox e emite filtro quando vem da URL
  private applyCategoryFromQuery(catId: string): void {
    this.selectedCategories.set([catId]);
    this.categoryOptions.update((options) =>
      options.map((opt) => ({ ...opt, checked: opt.id === catId })),
    );

    this.emitFilterChange();
  }

  // Category filter
  onCategoryChange(categoryId: string, checked: boolean): void {
    const categories = checked
      ? [...this.selectedCategories(), categoryId]
      : this.selectedCategories().filter((id) => id !== categoryId);

    this.selectedCategories.set(categories);
    this.emitFilterChange();
  }

  onBrandChange(brand: string, checked: boolean): void {
    const brands = checked
      ? [...this.selectedBrands(), brand]
      : this.selectedBrands().filter((b) => b !== brand);

    this.selectedBrands.set(brands);
    this.emitFilterChange();
  }

  onTagChange(tag: string, checked: boolean): void {
    const tags = checked
      ? [...this.selectedTags(), tag]
      : this.selectedTags().filter((t) => t !== tag);

    this.selectedTags.set(tags);
    this.emitFilterChange();
  }

  onPriceChange(): void {
    if (this.minPrice() > this.maxPrice()) {
      this.minPrice.set(this.maxPrice());
    }
    this.emitFilterChange();
  }

  onRatingChange(rating: number): void {
    this.selectedRating.set(this.selectedRating() === rating ? 0 : rating);
    this.emitFilterChange();
  }

  onInStockChange(checked: boolean): void {
    this.inStockOnly.set(checked);
    this.emitFilterChange();
  }

  onFreeShippingChange(checked: boolean): void {
    this.freeShippingOnly.set(checked);
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    const filter: ProductFilter = {};

    if (this.selectedCategories().length > 0) {
      filter.categories = this.selectedCategories();
    }

    if (this.selectedBrands().length > 0) {
      filter.brands = this.selectedBrands();
    }

    if (this.selectedTags().length > 0) {
      filter.tags = this.selectedTags();
    }

    if (this.minPrice() > this.priceRange().min || this.maxPrice() < this.priceRange().max) {
      filter.priceRange = {
        min: this.minPrice(),
        max: this.maxPrice(),
      };
    }

    if (this.selectedRating() > 0) {
      filter.rating = this.selectedRating();
    }

    if (this.inStockOnly()) {
      filter.inStock = true;
    }

    if (this.freeShippingOnly()) {
      filter.freeShipping = true;
    }

    this.filterChange.emit(filter);
  }

  clearFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.selectedTags.set([]);
    this.selectedRating.set(0);
    this.inStockOnly.set(false);
    this.freeShippingOnly.set(false);

    const range = this.priceRange();
    this.minPrice.set(range.min);
    this.maxPrice.set(range.max);

    // Update checkboxes
    this.categoryOptions.update((options) => options.map((opt) => ({ ...opt, checked: false })));
    this.brandOptions.update((options) => options.map((opt) => ({ ...opt, checked: false })));
    this.tagOptions.update((options) => options.map((opt) => ({ ...opt, checked: false })));

    this.emitFilterChange();
  }

  onCloseDrawer(): void {
    this.closeDrawer.emit();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  getStarArray(): number[] {
    return [5, 4, 3, 2, 1];
  }
}
