export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  badges?: string[];
  countryOfOrigin: string;
  protocols?: string[];
  useCases?: string[];
  keySpecs?: { [key: string]: string };
  compatibility?: string[];
  youtubeGuide?: string;
}