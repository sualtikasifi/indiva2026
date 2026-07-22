export interface Brochure {
  id: string;
  storeName: string;
  title: string;
  imageUrl: string;
  validityDate: string;
  createdAt?: any;
}

export interface Discount {
  id: string;
  title: string;
  brand?: string;
  category?: string;
  storeName?: string;
  oldPrice: number;
  newPrice: number;
  imageUrl: string;
  link?: string;
  isAd?: boolean;
  createdAt?: any;
}
