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
