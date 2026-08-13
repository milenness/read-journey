"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecommendedBooks } from "@/lib/api";
import Book from "@/components/Book/Book";
import Loader from "@/components/Loader/Loader"; // 👈 Імпортуємо ваш лоадер
import css from "./RecommendedBooks.module.css";

export default function RecommendedBooks() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommendedBooks"],
    queryFn: () => getRecommendedBooks({ page: 1, limit: 10 }),
  });

  const books = data?.results || [];

  return (
    <>
      {isLoading && <Loader />}

      <div className={css.wrapper}>
        <h2 className={css.title}>Recommended</h2>

        {isError && (
          <p style={{ color: "var(--color-red, red)", marginTop: "20px" }}>
            Oops! Something went wrong while loading books.
          </p>
        )}

        {!isLoading && !isError && books.length > 0 && (
          <ul className={css.booksList}>
            {books.map((book) => (
              <Book key={book._id} data={book} />
            ))}
          </ul>
        )}

        {!isLoading && !isError && books.length === 0 && (
          <p style={{ color: "var(--color-gray)", marginTop: "20px" }}>
            No books found.
          </p>
        )}
      </div>
    </>
  );
}
