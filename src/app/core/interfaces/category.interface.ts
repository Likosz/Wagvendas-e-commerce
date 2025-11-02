export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image: string;
  productCount: number;
  color: string;
  featured: boolean;
}
