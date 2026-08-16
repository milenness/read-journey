export interface IReadingProgress {
  _id?: string;
  startPage: number;
  startReading: string;
  finishPage?: number;
  finishReading?: string;
  speed?: number;
  status?: string;
}

export interface ITimeLeftToRead {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface IBook {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  totalPages: number;
  recommend?: boolean;
  status?: "unread" | "in-progress" | "done" | string;
  owner?: string;
  progress?: IReadingProgress[];
  timeLeftToRead?: ITimeLeftToRead;
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
}

export interface StartReadingRequest {
  id: string;
  page: number;
}

export interface FinishReadingRequest {
  id: string;
  page: number;
}

export interface DeleteReadingParams {
  bookId: string;
  readingId: string;
}
