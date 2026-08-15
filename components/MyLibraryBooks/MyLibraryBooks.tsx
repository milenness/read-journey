"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TbBooksOff } from "react-icons/tb";
import { MdOutlineNearbyError } from "react-icons/md";
import toast from "react-hot-toast";

import { getMyLibraryBooks, removeBookFromLibrary } from "@/lib/api";
import Book from "@/components/Book/Book";
import Loader from "@/components/Loader/Loader";
import { IBook } from "@/types/book";
import css from "./MyLibraryBooks.module.css";

export default function MyLibraryBooks() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("");

  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["libraryBooks", status],
    queryFn: () => getMyLibraryBooks(status || undefined),
  });

  // Фільтруємо дублікати за назвою, залишаючи лише першу унікальну книгу
  const uniqueBooks = books.filter(
    (book: IBook, index: number, self: IBook[]) =>
      index ===
      self.findIndex(
        (b) => b.title.toLowerCase().trim() === book.title.toLowerCase().trim(),
      ),
  );

  const { mutate: deleteBook, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => removeBookFromLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });
      toast.success("Book was successfully deleted from library.");
    },
    onError: () => {
      toast.error("Failed to delete the book. Please try again.");
    },
  });

  const handleDelete = (id: string) => {
    deleteBook(id);
  };

  return (
    <div className={css.wrapper}>
      <div className={css.headerWrapper}>
        <h2 className={css.title}>My library</h2>

        <div className={css.filterWrapper}>
          <select
            className={css.select}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All books</option>
            <option value="unread">Unread</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {(isLoading || isDeleting) && <Loader />}

      {isError && (
        <div className={css.errorStub}>
          <p className={css.noText}>
            <MdOutlineNearbyError className={css.errorIcon} size={100} />
            Oops! Something went wrong while loading your books.
          </p>
        </div>
      )}

      {!isLoading && !isError && uniqueBooks.length > 0 && (
        <ul className={css.booksList}>
          {uniqueBooks.map((book: IBook) => (
            <Book
              key={book._id}
              data={book}
              showDeleteBtn={true}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {!isLoading && !isError && uniqueBooks.length === 0 && (
        <div className={css.errorStub}>
          <TbBooksOff className={css.errorIcon} size={100} />
          <p className={css.noText}>No books found in your library.</p>
        </div>
      )}
    </div>
  );
}
