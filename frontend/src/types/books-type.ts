import type { UserInterface } from "./user-type";

export interface Book {
  _id: string;
  name: string;
  slug: string;
  images: Images[];
  author: string;
  category: BookCategory;
  publishingHouse: string;
  publishYear: number;
  language: string;
  pageNumber: number;
  description: string;
  salesCount: number;
  reviews: Review[]
  price: number;
  stock: number;
  isActive: boolean;
  createdAt?: string;      
  updatedAt?: string;    
}
export interface Review {
  _id?: string;            
  name: string;
  rating: number;          
  comment: string;
  user: string | UserInterface;           
  createdAt?: string;      
  updatedAt?: string;     
}
export interface Images {
  url: string;
  public_id: string
}
export interface BookCategory {
  categoryName: string;
  categorySlug: string;
}

export interface BookQueryResult {
  books: Book[];
  page: number;
  pages: number;
  hasMore: boolean;
}
