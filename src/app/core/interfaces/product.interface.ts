export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  // Preço
  price: number;
  originalPrice?: number;
  discount?: number;

  // Categoria e Tags
  category: string;
  categoryName: string;
  tags: string[];

  // Imagens
  images: string[];
  thumbnail: string;

  // Estoque
  stock: number;
  inStock: boolean;
  lowStock: boolean;
  // Avaliações
  rating: number;
  reviewCount: number;

  // Características
  brand: string;
  sku: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };

  // Variações (ex: cor, tamanho)
  variants?: ProductVariant[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Flags
  featured: boolean;
  isNew: boolean;
  bestseller: boolean;
  freeShipping: boolean;

  // Datas
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductVariant {
  id: string;
  type: 'color' | 'size' | 'material' | 'other';
  name: string;
  value: string;
  priceModifier?: number;
  stockModifier?: number;
  image?: string;
}

export enum ProductSortOption {
  RELEVANCE = 'relevance',
  PRICE_LOW_HIGH = 'price_asc',
  PRICE_HIGH_LOW = 'price_desc',
  NAME_A_Z = 'name_asc',
  NAME_Z_A = 'name_desc',
  RATING = 'rating_desc',
  NEWEST = 'newest',
  BESTSELLER = 'bestseller',
}

export interface ProductFilter {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  brands?: string[];
  tags?: string[];
  rating?: number;
  inStock?: boolean;
  freeShipping?: boolean;
  featured?: boolean;
  isNew?: boolean;
}
