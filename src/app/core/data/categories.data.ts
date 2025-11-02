/** a fazer: Substituir por dados reais da API quando backend estiver pronto */

import { Category } from '../interfaces/category.interface';

export const CATEGORIES_MOCK: Category[] = [
  {
    id: '1',
    name: 'Eletrônicos',
    slug: 'eletronicos',
    description: 'Smartphones, notebooks, tablets e muito mais',
    icon: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop',
    productCount: 1234,
    color: 'from-blue-500 to-cyan-500',
    featured: true,
  },
  {
    id: '2',
    name: 'Moda',
    slug: 'moda',
    description: 'Roupas, calçados e acessórios para todos os estilos',
    icon: 'Shirt',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop',
    productCount: 2890,
    color: 'from-pink-500 to-rose-500',
    featured: true,
  },
  {
    id: '3',
    name: 'Casa & Decoração',
    slug: 'casa-decoracao',
    description: 'Móveis, utensílios e itens para deixar sua casa linda',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&auto=format&fit=crop',
    productCount: 1567,
    color: 'from-amber-500 to-orange-500',
    featured: true,
  },
  {
    id: '4',
    name: 'Esportes',
    slug: 'esportes',
    description: 'Equipamentos, roupas e acessórios esportivos',
    icon: 'Dumbbell',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
    productCount: 987,
    color: 'from-green-500 to-emerald-500',
    featured: true,
  },
  {
    id: '5',
    name: 'Beleza',
    slug: 'beleza',
    description: 'Cosméticos, perfumes e cuidados pessoais',
    icon: 'Sparkles',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
    productCount: 2145,
    color: 'from-purple-500 to-fuchsia-500',
    featured: true,
  },
  {
    id: '6',
    name: 'Livros',
    slug: 'livros',
    description: 'Livros físicos, e-books e audiobooks',
    icon: 'Book',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop',
    productCount: 3456,
    color: 'from-indigo-500 to-blue-500',
    featured: true,
  },
  {
    id: '7',
    name: 'Games',
    slug: 'games',
    description: 'Jogos, consoles e acessórios para gamers',
    icon: 'Gamepad2',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop',
    productCount: 876,
    color: 'from-red-500 to-orange-500',
    featured: true,
  },
  {
    id: '8',
    name: 'Alimentos & Bebidas',
    slug: 'alimentos-bebidas',
    description: 'Produtos gourmet, bebidas especiais e snacks',
    icon: 'Coffee',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop',
    productCount: 1923,
    color: 'from-yellow-500 to-amber-500',
    featured: false,
  },
];
