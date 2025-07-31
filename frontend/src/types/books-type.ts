import type { UserInterface } from "./user-type";

export interface Book {
  _id: string;
  name: string;
  slug: string;
  image: string[];
  author: string;
  type: BookType;
  genres: BookGenres;
  publishingHouse: string;
  publishYear: number;
  language: string;
  pageNumber: number;
  description: string;
  salesCount: number;
  price: number;
  stock: number;
  isActive: boolean;
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
export interface image {
  url: string;
}
export interface BookType {
  typeName: string;
  typeSlug: string;
}

export interface BookGenres {
  genreName: string;
  genreSlug: string;
}
export interface BookQueryResult {
  books: Book[];
  page: number;
  pages: number;
  hasMore: boolean;
}
