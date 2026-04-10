export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isSeasonal?: boolean;
  isPopular?: boolean;
  isVegan?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  priceRange: string;
  image: string;
  category: string;
  description: string;
  menu: MenuItem[];
}

export const CATEGORIES = [
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'pastry', name: 'Pastry', icon: '🥐' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'The Iron Skillet',
    rating: 4.8,
    deliveryTime: '15-25 min',
    deliveryFee: 0,
    priceRange: '$$$',
    category: 'American',
    description: 'Artisan comfort food forged in flame. Discover our curated selection of seasonal flavors prepared in traditional cast iron.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    menu: [
      {
        id: 'm1',
        name: 'Heritage Ribeye',
        description: '45-day dry-aged heritage beef, flame-seared in garlic herb butter with charred vine tomatoes.',
        price: 42.00,
        image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800',
        category: 'Signature Mains'
      },
      {
        id: 'm2',
        name: 'Skillet Salmon',
        description: 'Crispy skin Atlantic salmon served with wild asparagus and lemon-caper glaze.',
        price: 34.00,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
        category: 'Signature Mains'
      },
      {
        id: 'm3',
        name: 'Crispy Sprouts',
        description: 'Honey balsamic glaze, toasted pecans, and crispy applewood pancetta.',
        price: 14.00,
        image: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=800',
        category: 'Small Plates'
      }
    ]
  },
  {
    id: '2',
    name: "Luigi's Atelier",
    rating: 4.5,
    deliveryTime: '20-35 min',
    deliveryFee: 2.00,
    priceRange: '$$',
    category: 'Italian',
    description: 'Authentic Italian flavors crafted with passion and the finest imported ingredients.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    menu: [
      {
        id: 'm4',
        name: 'Truffle Tagliatelle',
        description: 'Hand-cut pasta tossed in a creamy black truffle sauce with aged parmesan.',
        price: 28.00,
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800',
        category: 'Pasta'
      }
    ]
  }
];

export const FEATURED_ITEMS: MenuItem[] = [
  {
    id: 'f1',
    name: 'Zen Garden Bowl',
    description: 'Avocado, quinoa, edamame, and pickled ginger with a miso-tahini dressing.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: 'Seasonal',
    isSeasonal: true
  },
  {
    id: 'f2',
    name: 'Truffle Smash',
    description: 'Double wagyu patty, truffle aioli, caramelized onions on a brioche bun.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
    category: 'Burgers',
    isPopular: true
  }
];
