export interface IBook {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  totalPages: number;
  recommend: boolean;
}

export interface IBooksResponse {
  results: IBook[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface GetBooksParams {
  title?: string;
  author?: string;
  page?: number;
  limit?: number;
}

export interface AddBookRequest {
  title: string;
  author: string;
  totalPages: number;
};